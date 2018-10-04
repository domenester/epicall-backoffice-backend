import {Request} from "express-serve-static-core";
import * as jwt from "jsonwebtoken";
import * as request from "request-promise";
import * as winston from "winston";
import { ResetPasswordService } from "../../../../services";
import {HandlerResponse, IEndpoint, IRequest, Verb} from "../../../endpoint/endpoint.interface";
import { errorGenerator } from "../../../error/error";
import { changePassword as errorMessage } from "../../../error/error-messages";
import { ResetPasswordValidation } from "../validation";
import JwtHandler from "../../../../utils/jwt-handle";
import responseMessages from "../../../../config/endpoints-response-messages";

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

    let decoded: any; 
    
    try {
      decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);
    } catch (err) {
      return errorGenerator(
        JwtHandler(err.message), 400, err.name,
      )
    }

    const resetPasswordService = await ResetPasswordService({
      newPassword: req.body.password,
      email: decoded.email
    });

    if (resetPasswordService instanceof Error) { return resetPasswordService; }
    return { data: resetPasswordService, message: responseMessages.resetPassword };
  }
}
