
import {Request} from "express-serve-static-core";
import * as winston from "winston";
import {IEndpoint, IEndpointAPI} from "../../endpoint/endpoint.interface";
import UploadProfilePicture from "./endpoints/user-profile-picture";
import UserList from "./endpoints/user-list";

class UserApi implements IEndpointAPI {
  public path = "/user";
  public endpoints: Array<IEndpoint<Request, any>>;
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
    this.endpoints = [
      new UploadProfilePicture(this.logger),
      new UserList(this.logger)
    ];
  }
}

export default UserApi;
