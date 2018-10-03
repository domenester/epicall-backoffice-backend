import {Request} from "express-serve-static-core";
import * as request from "request-promise";
import * as winston from "winston";
import { ResetPasswordService } from "../../../../services";
import {HandlerResponse, IEndpoint, IRequest, Verb} from "../../../endpoint/endpoint.interface";
import { errorGenerator } from "../../../error/error";
import { changePassword as errorMessage } from "../../../error/error-messages";
import { ResetPasswordValidation } from "../validation";

export default class ResetPassword implements IEndpoint<Request, {}> {
  public path = "/reset";
  public method: Verb = "post";
  public bodySchema = "";
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
  }
  public handler = async (req: IRequest): Promise<HandlerResponse> => {
    this.logger.info(`Accessing path: ${this.path}`);

    const validation = await ResetPasswordValidation(req.body);

    if (validation instanceof Error) {
      return validation;
    }

    const resetPasswordService = await ResetPasswordService(req.body);

    if (resetPasswordService instanceof Error) { return resetPasswordService; }
    return { data: resetPasswordService, message: "Senha alterada com sucesso" };
  }
}
