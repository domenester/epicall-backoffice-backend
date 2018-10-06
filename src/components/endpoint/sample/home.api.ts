
import {Request} from "express-serve-static-core";
import * as winston from "winston";
import {IEndpoint, IEndpointAPI} from "../../endpoint/endpoint.interface";
import Home from "./endpoints/home";

class HomeApi implements IEndpointAPI {
  public path = "";
  public endpoints: Array<IEndpoint<Request, any>>;
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
    this.endpoints = [
      new Home(this.logger),
    ];
  }
}

export default HomeApi;
