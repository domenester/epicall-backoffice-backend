import { ErrorRequestHandler } from "express-serve-static-core";
import ILogger from "../logger/logger.interface";

export interface IErrorGenerator extends Error {
  code: number;
  stack: string;
}

class ErrorHandler {

    private logger: ILogger;

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    public handler: ErrorRequestHandler = (err: IErrorGenerator, req, res, next) => {
        if (err) {
            this.logger.log("error", err);
            res.status(err.code).send(err.message);
        } else {
          next();
        }
    }
}

export default ErrorHandler;

export const errorHandler = (Logger: ILogger): ErrorRequestHandler => {
  const e = new ErrorHandler (Logger);
  return e.handler;
};

export const errorGenerator = (message: string, code: number, stack: string): Error => {
  const error = new Error(message) as IErrorGenerator;
  error.code = code;
  error.stack = stack;
  return error;
};
