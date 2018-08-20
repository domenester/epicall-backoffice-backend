import * as winston from "winston";
import ILogger, { winstonLevels } from "./logger.interface";

const { combine, timestamp, label, printf } = winston.format;

const defaultFormat = printf((info) => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`);
const level: winstonLevels = "info";

export default (): winston.Logger => winston.createLogger({
  format: combine(
      label({ label: "Global" }),
      timestamp(),
      defaultFormat,
    ),
  level,
  transports: [new winston.transports.Console()],
});
