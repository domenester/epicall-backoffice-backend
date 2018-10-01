import {Request} from "express-serve-static-core";
import * as request from "request-promise";
import * as winston from "winston";
import {IEndpoint, IRequest, Verb} from "../../../endpoint/endpoint.interface";
import { errorGenerator } from "../../../error/error";
import { login as errorMessage } from "../../../error/error-messages";
import { LoginValidation } from "../validation/login.validation";

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

    const validation = await LoginValidation(req.body);

    if (validation instanceof Error) {
      return validation;
    }

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
      return errorGenerator(
        errorMessage.unauthorized,
        err.statusCode,
        "Login");
    });

    return response;
  }
}
