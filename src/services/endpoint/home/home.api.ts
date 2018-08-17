import {Request} from "express-serve-static-core";
import {IEndpoint, IEndpointAPI, IRequest} from "../../endpoint/endpoint.interface";
import ILogger from "../../logger/logger.interface";
import Home from "./endpoints/home";

class HomeApi implements IEndpointAPI {
  public path = "";
  public endpoints: Array<IEndpoint<Request, any>>;
  private logger: ILogger;
  constructor(logger: ILogger) {
    this.logger = logger;
    this.endpoints = [
      new Home(this.logger),
    ];
  }
}

export default HomeApi;
