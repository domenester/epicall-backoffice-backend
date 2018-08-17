import {Request, Response} from "express-serve-static-core";
import {IEndpoint, IRequest, Verb} from "../../../endpoint/endpoint.interface";
import {errorGenerator} from "../../../error/error";
import ILogger from "../../../logger/logger.interface";

export default class Home implements IEndpoint<Request, {}> {
  public path = "/";
  public method: Verb = "get";
  public bodySchema = "";
  private logger: ILogger;
  constructor(logger: ILogger) {
    this.logger = logger;
  }
  public handler = (request: IRequest) => {
    this.logger.log("info", `Accessing path: ${this.path}`);
    // TODO: Logic to this endpoint
    // throw errorGenerator("Teste", 402, "home");
    // return Promise.reject(errorGenerator("Teste", 402, "home"));
    return Promise.resolve({content: "Hi"});
  }
}
