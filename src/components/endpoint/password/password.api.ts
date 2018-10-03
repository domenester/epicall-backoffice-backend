
import {Request} from "express-serve-static-core";
import * as winston from "winston";
import {IEndpoint, IEndpointAPI} from "../../endpoint/endpoint.interface";
import ChangePassword from "./endpoints/change-password";
import RequestPassword from "./endpoints/request-password";

class PasswordApi implements IEndpointAPI {
  public path = "/password";
  public endpoints: Array<IEndpoint<Request, any>>;
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
    this.endpoints = [
      new ChangePassword(this.logger),
      new RequestPassword(this.logger),
    ];
  }
}

export default PasswordApi;
