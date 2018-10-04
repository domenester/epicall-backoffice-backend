import {Request} from "express-serve-static-core";
import * as request from "request-promise";
import * as winston from "winston";
import { ChangePasswordService } from "../../../../services";
import {HandlerResponse, IEndpoint, IRequest, Verb} from "../../../endpoint/endpoint.interface";
import { errorGenerator } from "../../../error/error";
import { changePassword as errorMessage } from "../../../error/error-messages";
import { ChangePasswordValidation } from "../validation";
import responseMessages from "../../../../config/endpoints-response-messages";

export default class ChangePassword implements IEndpoint<Request, {}> {
  public path = "/change";
  public method: Verb = "post";
  public bodySchema = "";
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
  }
  public handler = async (req: IRequest): Promise<HandlerResponse> => {
    this.logger.info(`Accessing path: ${this.path}`);

    const validation = await ChangePasswordValidation(req.body);

    if (validation instanceof Error) {
      return validation;
    }

    const changePasswordService = await ChangePasswordService(req.body);

    if (changePasswordService instanceof Error) { return changePasswordService; }
    return { data: changePasswordService, message: responseMessages.changePassword };
  }
}
