
import {Request} from "express-serve-static-core";
import * as winston from "winston";
import {IEndpoint, IEndpointAPI} from "../../endpoint/endpoint.interface";
import UploadProfilePicture from "./endpoints/user-profile-picture";
import UserList from "./endpoints/user-list";
import UserNew from "./endpoints/user-new";
import UserUpdate from "./endpoints/user-update";
import UserEnums from "./endpoints/user-enums";
import UserDelete from "./endpoints/user-delete";

class UserApi implements IEndpointAPI {
  public path = "/user";
  public endpoints: Array<IEndpoint<Request, any>>;
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
    this.endpoints = [
      new UploadProfilePicture(this.logger),
      new UserList(this.logger),
      new UserNew(this.logger),
      new UserEnums(this.logger),
      new UserUpdate(this.logger),
      new UserDelete(this.logger)
    ];
  }
}

export default UserApi;
