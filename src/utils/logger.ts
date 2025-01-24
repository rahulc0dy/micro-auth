import { createLogger, format, transports } from "winston";
import { LOG_LEVEL } from "../env.ts";
import chalk from "chalk";

const { timestamp, combine, printf, json } = format;

const jsonLogFormat = combine(
  timestamp(),
  printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  }),
  json(),
);

const consoleLogFormat = combine(
  timestamp(),
  printf(({ level, message, timestamp }) => {
    const levelStyles: Record<string, string> = {
      info: chalk.bgGreenBright.black.bold(level.toUpperCase()),
      error: chalk.bgRedBright.black.bold(level.toUpperCase()),
      warn: chalk.bgYellowBright.black.bold(level.toUpperCase()),
      debug: chalk.bgBlueBright.black.bold(level.toUpperCase()),
    };

    if (typeof message === "object") {
      try {
        message = JSON.stringify(message, null, 2);
      } catch (_error) {
        message =
          "[Circular Reference Error] Unable to stringify object. Please see log file.";
      }
    }

    const styledLevel = levelStyles[level] || level.toUpperCase();
    const styledTimestamp = chalk.gray(`[${timestamp}]`);

    return `${styledTimestamp} ${styledLevel}: ${message}`;
  }),
);

const logger = createLogger({
  level: LOG_LEVEL,
  format: combine(timestamp()),
  transports: [
    new transports.Console({
      format: consoleLogFormat,
    }),
    new transports.File({
      filename: "logs/app.log",
      format: jsonLogFormat,
    }),
  ],
});

export default logger;
