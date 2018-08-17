import * as express from "express";
import {ErrorRequestHandler} from "express-serve-static-core";
import * as http from "http";
import serverConfigs from "./config/server";
import {IEndpointAPI} from "./services/endpoint/endpoint.interface";
import EndpointsApi from "./services/endpoint/index";
import {errorGenerator, errorHandler, IErrorGenerator} from "./services/error/error";
import Logger from "./services/logger/logger";
import ILogger from "./services/logger/logger.interface";

class Server {

    public app: express.Application;

    private server: http.Server;

    private port: number = serverConfigs.port;

    private logger: ILogger;

    private errorHandler: ErrorRequestHandler;

    constructor() {
        this.app = express();
        this.logger = Logger;
        this.errorHandler = errorHandler(this.logger);
    }

    public async start(): Promise<void> {
      try {
        await Promise.all([
          this.exposeEndpoints(),
          this.middlewares(),
        ]);
        this.server = this.app.listen(this.port, () => {
          this.logger.log("info", `Listening at port: ${this.port}`);
        });
      } catch (err) {
        this.logger.log("error", err);
        throw err;
      }
    }

    private middlewares(): Promise<any> {
      try {
        return new Promise( (resolve, reject) => {
          this.app.use([
            this.errorHandler,
          ]);
          return resolve();
        });
      } catch (err) {
        this.logger.log("error", err);
        throw err;
      }
    }

    private async exposeEndpoints(): Promise<{}> {
      try {
        if (!EndpointsApi) {
          throw errorGenerator("No endpoint found to expose", 500, "");
        }
        return new Promise((resolve) => {
          EndpointsApi.map((endpointApiClass) => {
            const endpointApi = new endpointApiClass(this.logger);
            endpointApi.endpoints.map((endpoint) => {
              const endpointPath = `${endpointApi.path}${endpoint.path}`;
              this.app[endpoint.method](endpointPath, async (req, res) => {
                try {
                  if ( (endpoint.method === "post" || endpoint.method === "put") && !req.body) {
                    // tslint:disable-next-line:max-line-length
                    const message = `Requisição sem corpo para método ${endpoint.method.toUpperCase()} no endereço ${endpointPath}`;
                    this.logger.log("error", message);
                    return res.status(400).json(message);
                  }
                  const result = await endpoint.handler({
                    body: req.body,
                    headers: req.headers,
                    parameters: req.params,
                  });
                  return res.json(result);
                } catch (err) {
                  return res.json(err.code).send(err);
                }
              });
            });
          });
          return resolve();
        });
      } catch (err) {
        this.logger.log("error", err);
        throw err;
      }
    }
}

export default new Server();
