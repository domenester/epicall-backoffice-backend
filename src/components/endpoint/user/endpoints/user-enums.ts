import {Request} from "express-serve-static-core";
import * as winston from "winston";
import {IEndpoint, IRequest, Verb, HandlerResponse} from "../../../endpoint/endpoint.interface";
import enums from "../enums";

export default class UserEnums implements IEndpoint<Request, {}> {
  public path = "/enums";
  public method: Verb = "get";
  public bodySchema = "";
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
  }
  public handler = async (req: IRequest): Promise<HandlerResponse> => {
    this.logger.info(`Accessing path: ${this.path}`);
    return {data: enums};
  }
}
