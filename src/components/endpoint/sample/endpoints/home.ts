import {Request} from "express-serve-static-core";
import * as winston from "winston";
import {IEndpoint, IRequest, Verb} from "../../../endpoint/endpoint.interface";

export default class Home implements IEndpoint<Request, {}> {
  public path = "/";
  public method: Verb = "get";
  public bodySchema = "";
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
  }
  public handler = (request: IRequest) => {
    this.logger.info(`Accessing path: ${this.path}`);
    // TODO: Logic to this endpoint
    return {content: "Hi"};
  }
}
