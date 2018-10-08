import {Request} from "express-serve-static-core";
import * as winston from "winston";
import {IEndpoint, IRequest, Verb, HandlerResponse} from "../../../endpoint/endpoint.interface";
import * as fs from "fs";
import { UserService } from "../../../../services";
import { UserProfilePictureValidation } from "../validations/user-profile-picture.validation";
import responseMessages from "../../../../config/endpoints-response-messages";
import { errorGenerator } from "../../../error";

export default class UserList implements IEndpoint<Request, {}> {
  public path = "/list";
  public method: Verb = "get";
  public bodySchema = "";
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
  }
  public handler = async (request: IRequest): Promise<HandlerResponse> => {
    this.logger.info(`Accessing path: ${this.path}`);

    const listUser = await UserService.list();
    if (listUser instanceof Error) { return listUser; }

    return {data: listUser, message: responseMessages.userList};
  }
}
