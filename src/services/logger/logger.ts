import * as winston from "winston";

const { combine, timestamp, label, printf } = winston.format;

type winstonLevels = "error" | "warn" | "info" | "verbose" | "debug" | "silly";

class Logger {

    private defaultFormat = printf((info) => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`);

    private level: winstonLevels = "info";

    private logger = winston.createLogger({
        format: combine(
            label({ label: "Stack" }),
            timestamp(),
            this.defaultFormat,
          ),
        level: this.level,
        transports: [new winston.transports.Console()],
    });

    public log(level: winstonLevels, message: string): void {
        this.logger.log({level, message});
    }
}

export default new Logger();
