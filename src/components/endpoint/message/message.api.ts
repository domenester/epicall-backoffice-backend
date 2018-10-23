
import {Request} from "express-serve-static-core";
import * as winston from "winston";
import {IEndpoint, IEndpointAPI} from "../../endpoint/endpoint.interface";
import Message from "./endpoints/message-list";

class MessageApi implements IEndpointAPI {
  public path = "/messages";
  public endpoints: Array<IEndpoint<Request, any>>;
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
    this.endpoints = [
      new Message(this.logger),
    ];
  }
}

export default MessageApi;
