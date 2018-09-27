import {Request} from "express-serve-static-core";
import * as request from "request-promise";
import * as winston from "winston";
import {IEndpoint, IRequest, Verb} from "../../../endpoint/endpoint.interface";
import { errorGenerator } from "../../../error/error";

export default class Login implements IEndpoint<Request, {}> {
  public path = "/login";
  public method: Verb = "post";
  public bodySchema = "";
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
  }
  public handler = async (req: IRequest) => {
    this.logger.info(`Accessing path: ${this.path}`);
    const response = await request(
      `${process.env.APP_API}/login`, {
        body: JSON.stringify(req.body),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        rejectUnauthorized: false,
      },
    ).catch( (err) => {
      this.logger.error(`Error requesting for: ${process.env.APP_API}/login`);
      return err;
    });

    if (response.statusCode >= 400) {
      return errorGenerator(`Error requesting for: ${process.env.APP_API}/login`, response.statusCode, "Login");
    }

    return response;
  }
}
