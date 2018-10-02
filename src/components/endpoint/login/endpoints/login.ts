import {Request} from "express-serve-static-core";
import * as request from "request-promise";
import * as winston from "winston";
import { LoginService } from "../../../../services";
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

    const loginService = await LoginService(req.body);

    return loginService;
  }
}
