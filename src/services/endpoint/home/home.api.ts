import {Request} from "express-serve-static-core";
import {IEndpoint, IEndpointAPI, IRequest} from "../../endpoint/endpoint.interface";
import Home from "./endpoints/home";

class HomeApi implements IEndpointAPI {
  public path = "";
  public endpoints: Array<IEndpoint<Request, any>>;
  constructor() {
    this.endpoints = [
      new Home(),
    ];
  }
}

export default new HomeApi();
