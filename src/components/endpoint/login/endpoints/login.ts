import {Request} from "express-serve-static-core";
import * as request from "request-promise";
import * as winston from "winston";
import { LoginService, UserService } from "../../../../services";
import {HandlerResponse, IEndpoint, IRequest, Verb} from "../../../endpoint/endpoint.interface";
import { errorGenerator } from "../../../error/error";
import { login as errorMessage } from "../../../error/error-messages";
import { LoginValidation } from "../validation/login.validation";
import responseMessages from "../../../../config/endpoints-response-messages";

export default class Login implements IEndpoint<Request, {}> {
  public path = "/login";
  public method: Verb = "post";
  public bodySchema = LoginValidation;
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
  }
  public handler = async (req: IRequest): Promise<HandlerResponse> => {
    this.logger.info(`Accessing path: ${this.path}`);

    const validation = await this.bodySchema(req.body);

    if (validation instanceof Error) {
      return validation;
    }

    const loginService = await LoginService(req.body);

    if (loginService instanceof Error) { return loginService; }

    const userById = await UserService.getById(loginService.data.owner_id);

    return { 
      data: userById, 
      message: responseMessages.login 
    };
  }
}
