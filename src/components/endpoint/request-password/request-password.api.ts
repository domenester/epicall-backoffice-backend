
import {Request} from "express-serve-static-core";
import * as winston from "winston";
import {IEndpoint, IEndpointAPI} from "../../endpoint/endpoint.interface";
import RequestPassword from "./endpoints/request-password";

class RequestPasswordApi implements IEndpointAPI {
  public path = "";
  public endpoints: Array<IEndpoint<Request, any>>;
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
    this.endpoints = [
      new RequestPassword(this.logger),
    ];
  }
}

export default RequestPasswordApi;
