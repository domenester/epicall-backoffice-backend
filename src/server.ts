import * as express from "express";
import {ErrorRequestHandler} from "express-serve-static-core";
import * as http from "http";
import serverConfigs from "./config/server";
import {IEndpointAPI} from "./services/endpoint/endpoint.interface";
import EndpointsApi from "./services/endpoint/index";
import {errorGenerator, errorHandler} from "./services/error/error";
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
        // await this.middlewares();
        await this.exposeEndpoints();
        this.server = this.app.listen(this.port, () => {
          this.logger.log("info", `Listening at port: ${this.port}`);
        });
    }

    private middlewares(): Promise<any> {
      return new Promise( (resolve, reject) => {
        try {
          this.app.use([
            this.errorHandler,
          ]);
          return resolve();
        } catch (e) { return reject(e); }
      });
    }

    private async exposeEndpoints(): Promise<{}> {
      if (!EndpointsApi) {
        return Promise.reject(errorGenerator("No endpoint found to expose", 500, ""));
      }
      return new Promise( (resolve, reject) => {
        try {
          EndpointsApi.map( (endpointApi) => {
            endpointApi.endpoints.map( (endpoint) => {
              const endpointPath = `${endpointApi.path}${endpoint.path}`;
              this.app[endpoint.method](endpointPath, async (req, res) => {
                if ( (endpoint.method === "post" || endpoint.method === "put") && !req.body) {
                  throw errorGenerator(
                    `Requisição sem corpo para método ${endpoint.method.toUpperCase()} no endereço ${endpointPath}`,
                    400,
                    "Página Inicial");
                }
                const result = await endpoint.handler({
                  body: req.body,
                  headers: req.headers,
                  parameters: req.params,
                });
                return res.send(result);
              });
            });
          });
          return resolve();
        } catch (e) { return reject(e); }
      });
    }
}

export default new Server();
