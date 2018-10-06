import {Request} from "express-serve-static-core";
import * as winston from "winston";
import {IEndpoint, IRequest, Verb, HandlerResponse} from "../../../endpoint/endpoint.interface";

export default class UploadProfilePicture implements IEndpoint<Request, {}> {
  public path = "/uploadProfilePicture";
  public method: Verb = "post";
  public bodySchema = "";
  private logger: winston.Logger;
  constructor(logger: winston.Logger) {
    this.logger = logger;
  }
  public handler = (request: IRequest): Promise<HandlerResponse> | HandlerResponse => {
    this.logger.info(`Accessing path: ${this.path}`);
    // TODO: Logic to this endpoint
    return {data: "Hi", message: ""};
  }
}
