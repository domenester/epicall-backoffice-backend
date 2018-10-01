import {Request} from "express-serve-static-core";
import * as request from "request-promise";
import * as winston from "winston";
import {IEndpoint, IRequest, Verb} from "../../../endpoint/endpoint.interface";
import { errorGenerator } from "../../../error/error";
import { changePassword as errorMessage } from "../../../error/error-messages";
import { ChangePasswordValidation } from "../validation/change-password.validation";

export default class ChangePassword implements IEndpoint<Request, {}> {
  public path = "/changePassword";
  public method: Verb = "post";
  public bodySchema = "";
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
  }
  public handler = async (req: IRequest) => {
    this.logger.info(`Accessing path: ${this.path}`);

    const validation = await ChangePasswordValidation(req.body);

    if (validation instanceof Error) {
      return validation;
    }

    const response = await request(
      `${process.env.APP_API}/users/${req.body.userId}/update_password`, {
        body: JSON.stringify({
          newPassword: req.body.newPassword,
          password: req.body.password,
          username: req.body.username,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        rejectUnauthorized: false,
      },
    ).catch( (err) => {
      this.logger.error(`Error requesting for: ${process.env.APP_API}/users/<userId>/update_password`);
      return errorGenerator(
        errorMessage.unauthorized,
        err.statusCode,
        "changePassword");
    });

    return response;
  }
}
