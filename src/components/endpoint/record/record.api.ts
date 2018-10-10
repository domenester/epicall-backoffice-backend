
import {Request} from "express-serve-static-core";
import * as winston from "winston";
import {IEndpoint, IEndpointAPI} from "../../endpoint/endpoint.interface";
import RecordList from "./endpoints/record-list";

class UserApi implements IEndpointAPI {
  public path = "/record";
  public endpoints: Array<IEndpoint<Request, any>>;
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
    this.endpoints = [
      new RecordList(this.logger),
    ];
  }
}

export default UserApi;
