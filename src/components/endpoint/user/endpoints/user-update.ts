import {Request} from "express-serve-static-core";
import * as winston from "winston";
import {IEndpoint, IRequest, Verb, HandlerResponse} from "../../../endpoint/endpoint.interface";
import { UserService } from "../../../../services";
import responseMessages from "../../../../config/endpoints-response-messages";
import { UserUpdateValidation } from "../validations/user-update.validation";

export default class UserUpdate implements IEndpoint<Request, {}> {
  public path = "/update";
  public method: Verb = "post";
  public bodySchema = "";
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
  }
  public handler = async (req: IRequest): Promise<HandlerResponse> => {
    this.logger.info(`Accessing path: ${this.path}`);

    const validation = await UserUpdateValidation(req.body);

    if (validation instanceof Error) {
      return validation;
    }

    const userUpdate = await UserService.update(req.body);
    if (userUpdate instanceof Error) { return userUpdate; }

    return {data: userUpdate, message: responseMessages.userUpdate};
  }
}
