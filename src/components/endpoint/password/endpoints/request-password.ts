import {Request} from "express-serve-static-core";
import * as jwt from "jsonwebtoken";
import * as request from "request-promise";
import * as winston from "winston";
import Mailer from "../../../../components/mailer/mailer";
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

    const token = jwt.sign(
      { email: req.body.email }, process.env.JWT_SECRET, { expiresIn: 60 * 10 },
    );

    const mailResponse = await Mailer({
      subject: "Solicitação de recadastro de senha",
      text: `${process.env.FRONTEND_URL}/forgotPassword?token=${token}`,
      to: req.body.email,
    }).catch((err) => errorGenerator(err, 500, "ForgotPasswordMail"));

    return mailResponse;
  }
}
