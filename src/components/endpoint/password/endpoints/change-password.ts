import {Request} from "express-serve-static-core";
import * as request from "request-promise";
import * as winston from "winston";
import { ChangePasswordService } from "../../../../services";
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

    const changePasswordService = await ChangePasswordService(req.body);

    return changePasswordService;
  }
}
