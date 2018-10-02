import {Request} from "express-serve-static-core";
import * as request from "request-promise";
import * as winston from "winston";
import { UserService } from "../../../../services";
import {IEndpoint, IRequest, Verb} from "../../../endpoint/endpoint.interface";
import { errorGenerator } from "../../../error/error";
import { requestPassword as errorMessage } from "../../../error/error-messages";
import { RequestPasswordValidation } from "../validation/request-password.validation";

export default class RequestPassword implements IEndpoint<Request, {}> {
  public path = "/requestPassword";
  public method: Verb = "post";
  public bodySchema = "";
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
  }
  public handler = async (req: IRequest) => {
    this.logger.info(`Accessing path: ${this.path}`);

    const validation = await RequestPasswordValidation(req.body);

    if (validation instanceof Error) {
      return validation;
    }

    const emailExists = await UserService.emailExists(req.body.email);

    if (!emailExists) {
      return errorGenerator(errorMessage.emailNotFound, 401, "RequestPassword");
    }

  }
}
