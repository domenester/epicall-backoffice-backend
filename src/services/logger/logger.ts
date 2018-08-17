import * as winston from "winston";
import ILogger, { winstonLevels } from "./logger.interface";

const { combine, timestamp, label, printf } = winston.format;

class Logger implements ILogger {

    public defaultFormat = printf((info) => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`);

    public level: winstonLevels = "info";

    public logger = winston.createLogger({
        format: combine(
            label({ label: "Stack" }),
            timestamp(),
            this.defaultFormat,
          ),
        level: this.level,
        transports: [new winston.transports.Console()],
    });

    public log(level: winstonLevels, message: any): void {
        this.logger.log({level, message});
    }
}

export default new Logger();
