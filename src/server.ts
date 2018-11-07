import * as bodyParser from "body-parser";
import { NextHandleFunction } from "connect";
import * as cors from "cors";
import * as dotenv from "dotenv";
import * as express from "express";
import {ErrorRequestHandler} from "express-serve-static-core";
import * as http from "http";
import * as path from "path";
import * as winston from "winston";
import EndpointsApi from "./components/endpoint/index";
import {errorGenerator, errorHandler, IErrorGenerator} from "./components/error/error";
import {default as Logger} from "./components/logger/logger";
import { Database } from "./database";
import { default as serverConfigs } from "./config/server";
import * as multer from "multer";
import { Client } from "pg";

const env = process.env;
dotenv.config({ path: path.join(__dirname, "../.env")});

class Server {

    public app: express.Application;

    private server: http.Server;

    private port: number = +env.NODE_PORT || 3000;

    private host: string = env.NODE_HOST;

    private logger: winston.Logger;

    private errorHandler: ErrorRequestHandler;

    private database: Database;

    constructor() {
        this.app = express();
        this.logger = Logger;
        this.errorHandler = errorHandler(this.logger);
        this.database = new Database(process.env.DATABASE_URI);
    }

    public async start(): Promise<void> {
      try {
        await this.middlewares();
        await this.exposeEndpoints();
        this.server = this.app.listen(this.port, this.host, () => {
          this.logger.info(`Listening to: http://${this.host}:${this.port}`);
        });
      } catch (err) {
        this.logger.error(err);
        return err;
      }
    }

    public stop(): void {
      this.server.close();
    }

    private middlewares(): Promise<any> {
      const middlewares: Array<ErrorRequestHandler | NextHandleFunction> = [
        bodyParser.json({ limit: "5mb" }),
        bodyParser.urlencoded({ extended: true, limit: "5mb" })
      ];

      if (process.env.NODE_ENV === "development") {
        middlewares.push(this.errorHandler);
        middlewares.push(cors());
      }

      this.app.use('/public', express.static(__dirname + '/public'));

      if (middlewares.length > 0) {
        return Promise.resolve( this.app.use(middlewares) );
      }
    }

    private requestMiddleware(path: string): express.RequestHandler {
      switch (path) {
        case serverConfigs.pathsToMulter.avatar:
          return multer({ dest: `${__dirname}/` }).single('avatar');
        default: return ((req, res, next) => { next(); }) as express.RequestHandler;
      }
    }

    private exposeEndpoints(): Promise<{}> {
      if (!EndpointsApi) {
        throw errorGenerator("No endpoint found to expose", 500, "");
      }
      return new Promise((resolve) => {
        EndpointsApi.map((endpointApiClass) => {
          const endpointApi = new endpointApiClass(this.logger);
          endpointApi.endpoints.map((endpoint) => {
            const endpointPath = `${endpointApi.path}${endpoint.path}`;
            this.app[endpoint.method](endpointPath, this.requestMiddleware(endpoint.path), async (req, res) => {
              if ( (endpoint.method === "post" || endpoint.method === "put") && !req.body) {
                // tslint:disable-next-line:max-line-length
                const message = `Requisição sem corpo para método ${endpoint.method.toUpperCase()} no endereço ${endpointPath}`;
                this.logger.error(message);
                return res.status(400).json(message);
              }
              const result = await endpoint.handler({
                body: Object.keys(req.body).length > 0 ? req.body : req.files || req.file || {},
                headers: req.headers,
                parameters: req.query
              });

              if (result instanceof Error) {
                const error = result as any;
                return res.status(error.code).send({
                  code: error.code,
                  message: error.message,
                  stack: error.stack,
                } as IErrorGenerator);
              }

              return res.json(result);
            });
          });
        });
        return resolve();
      });
    }
}

export default new Server();
