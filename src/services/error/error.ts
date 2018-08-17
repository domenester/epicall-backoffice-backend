import { ErrorRequestHandler } from "express-serve-static-core";
import ILogger from "../logger/logger.interface";

interface IErrorGenerator extends Error {
  code: number;
  stack: string;
}

class ErrorHandler {

    private Logger: ILogger;

    constructor(Logger: ILogger) {
        this.Logger = Logger;
    }

    public handler: ErrorRequestHandler = (err: IErrorGenerator, req, res, next) => {
        if (err) {
            this.Logger.log("error", err);
            throw errorGenerator(err.message, err.code, err.stack);
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
