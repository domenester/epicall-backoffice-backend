import {Request} from "express-serve-static-core";
import * as jwt from "jsonwebtoken";
import * as request from "request-promise";
import * as winston from "winston";
import Mailer from "../../../../components/mailer/mailer";
import { UserService } from "../../../../services";
import {HandlerResponse, IEndpoint, IRequest, Verb} from "../../../endpoint/endpoint.interface";
import { errorGenerator } from "../../../error/error";
import { requestPassword as errorMessage } from "../../../error/error-messages";
import { RequestPasswordValidation } from "../validation";

export default class RequestPassword implements IEndpoint<Request, {}> {
  public path = "/request";
  public method: Verb = "post";
  public bodySchema = "";
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
  }
  public handler = async (req: IRequest): Promise<HandlerResponse> => {
    this.logger.info(`Accessing path: ${this.path}`);

    const validation = await RequestPasswordValidation(req.body);
    if (validation instanceof Error) { validation; }

    const emailExists = await UserService.emailExists(req.body.email).catch(err => err);
    if (emailExists instanceof Error) { return emailExists; }
    if (!emailExists) { return errorGenerator(errorMessage.emailNotFound, 400, "RequestPassword");}

    const token = jwt.sign(
      { email: req.body.email }, process.env.JWT_SECRET, { expiresIn: 60 * 10 },
    );

    // const mailResponse = await Mailer({
    //   subject: "Solicitação de recadastro de senha",
    //   text: `${process.env.FRONTEND_URL}/forgotPassword?token=${token}`,
    //   to: req.body.email,
    // }).catch((err) => errorGenerator(err, 500, "ForgotPasswordMail"));

    const mailResponse = { emailResponseMocked: true };

    if (mailResponse instanceof Error) { return mailResponse; }
    return { data: mailResponse, message: "Email enviado com sucesso" };
  }
}
