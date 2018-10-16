import {Request} from "express-serve-static-core";
import * as winston from "winston";
import {IEndpoint, IRequest, Verb, HandlerResponse} from "../../../endpoint/endpoint.interface";
import { UserService } from "../../../../services";
import responseMessages from "../../../../config/endpoints-response-messages";
import { UserNewValidation } from "../validations/user-new.validation";

export default class UserNew implements IEndpoint<Request, {}> {
  public path = "/new";
  public method: Verb = "put";
  public bodySchema = "";
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
  }
  public handler = async (req: IRequest): Promise<HandlerResponse> => {
    this.logger.info(`Accessing path: ${this.path}`);

    const validation = await UserNewValidation(req.body);

    if (validation instanceof Error) {
      return validation;
    }

    const addUser = await UserService.add(req.body);
    if (addUser instanceof Error) { return addUser; }

    return {data: addUser, message: responseMessages.userNew};
  }
}
