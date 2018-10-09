import {Request} from "express-serve-static-core";
import * as winston from "winston";
import {IEndpoint, IRequest, Verb, HandlerResponse} from "../../../endpoint/endpoint.interface";
import { UserService } from "../../../../services";
import responseMessages from "../../../../config/endpoints-response-messages";
import { UserDeleteValidation } from "../validations/user-delete.validation";

export default class UserDelete implements IEndpoint<Request, {}> {
  public path = "/delete";
  public method: Verb = "post";
  public bodySchema = "";
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
  }
  public handler = async (req: IRequest): Promise<HandlerResponse> => {
    this.logger.info(`Accessing path: ${this.path}`);

    const validation = await UserDeleteValidation(req.body);

    if (validation instanceof Error) {
      return validation;
    }

    const userDelete = await UserService.remove(req.body.userId);
    if (userDelete instanceof Error) { return userDelete; }

    return {data: userDelete, message: responseMessages.userDelete};
  }
}
