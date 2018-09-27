
import {Request} from "express-serve-static-core";
import * as winston from "winston";
import {IEndpoint, IEndpointAPI} from "../../endpoint/endpoint.interface";
import Login from "./endpoints/login";

class LoginApi implements IEndpointAPI {
  public path = "";
  public endpoints: Array<IEndpoint<Request, any>>;
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
    this.endpoints = [
      new Login(this.logger),
    ];
  }
}

export default LoginApi;
