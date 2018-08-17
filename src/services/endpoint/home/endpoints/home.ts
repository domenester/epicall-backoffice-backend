import {Request, Response} from "express-serve-static-core";
import {IEndpoint, IRequest, Verb} from "../../../endpoint/endpoint.interface";
import {errorGenerator} from "../../../error/error";

export default class Home implements IEndpoint<Request, {}> {
  public path = "/";
  public method: Verb = "get";
  public bodySchema = "";
  public handler = (request: IRequest) => {
    // TODO: Logic to this endpoint
    return Promise.resolve({content: "Hi"});
  }
}
