import {Request} from "express-serve-static-core";
import { Client } from "pg";
import * as winston from "winston";
import {IEndpoint, IRequest, Verb} from "../../../endpoint/endpoint.interface";
import { ReportListValidation } from "../validations/report-list.validation";
import { ReportQueries } from "../../../../database/queries";
import { errorGenerator } from "../../../error";

export default class Report implements IEndpoint<Request, {}> {
  public path = "/list";
  public method: Verb = "get";
  public bodySchema = "";
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
  }
  public handler = async (req: IRequest) => {
    this.logger.info(`Accessing path: ${this.path}`);

    const validation = await ReportListValidation(req.parameters);

    if (validation instanceof Error) {
      return validation;
    }

    const client = new Client(process.env.DATABASE_URI);
    client.connect().catch(err => errorGenerator(err));
    const reportQueries = new ReportQueries(client);
    const queryResult = await reportQueries.getAll();
    
    if (queryResult instanceof Error) { 
      return errorGenerator(
        queryResult.message,
        500,
        queryResult.stack
      );
    }

    return {data: queryResult.rows || []};
  }
}
