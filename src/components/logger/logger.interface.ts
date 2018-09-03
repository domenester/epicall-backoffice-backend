import * as logform from "logform";
import * as winston from "winston";

export type winstonLevels = "error" | "warn" | "info" | "verbose" | "debug" | "silly";

export default interface ILogger {
    defaultFormat: logform.Format;
    level: winstonLevels;
    logger: winston.Logger;
}
