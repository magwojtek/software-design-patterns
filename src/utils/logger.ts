import winston from 'winston';
import * as colors from './colors';

// Define color types as an enum
export enum LogColor {
    PHONE_DISPLAY,
    WEB_DISPLAY,
    SMART_HOME,
    WEATHER_STATION,
    INFO,
    SUCCESS,
    WARNING,
    ERROR,
    EMAIL_ALERT,

    // Command Pattern specific colors
    LIGHT_DEVICE,
    FAN_DEVICE,
    COMMAND_SETUP,
    COMMAND_EXECUTION,
    COMMAND_UNDO,
}

const colorMap: Record<LogColor, (text: string) => string> = {
    [LogColor.PHONE_DISPLAY]: colors.phoneDisplay,
    [LogColor.WEB_DISPLAY]: colors.webDisplay,
    [LogColor.SMART_HOME]: colors.smartHome,
    [LogColor.WEATHER_STATION]: colors.weatherStation,
    [LogColor.INFO]: colors.info,
    [LogColor.SUCCESS]: colors.success,
    [LogColor.WARNING]: colors.warning,
    [LogColor.ERROR]: colors.error,
    [LogColor.EMAIL_ALERT]: colors.emailAlert,

    // Command Pattern specific color mappings
    [LogColor.LIGHT_DEVICE]: colors.lightDevice,
    [LogColor.FAN_DEVICE]: colors.fanDevice,
    [LogColor.COMMAND_SETUP]: colors.commandSetup,
    [LogColor.COMMAND_EXECUTION]: colors.commandExecution,
    [LogColor.COMMAND_UNDO]: colors.commandUndo,
};

// Color mapping function
const colorize = (message: string, colorType: LogColor): string => {
    const colorFunction = colorMap[colorType];
    if (colorFunction) {
        return colorFunction(message);
    }
    return message; // Fallback to original message if no color function is found
};

// Logger class with a log method that takes message and colorType parameters
export class Logger {
    private winstonLogger: winston.Logger;

    constructor() {
        this.winstonLogger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ message }) => {
                    return `${message}`;
                }),
            ),
            transports: [new winston.transports.Console()],
        });
    }

    public log(message: string, colorType: LogColor): void {
        const coloredMessage = colorize(message, colorType);

        if (colorType === LogColor.ERROR) {
            this.winstonLogger.error(coloredMessage);
        } else if (colorType === LogColor.WARNING) {
            this.winstonLogger.warn(coloredMessage);
        } else {
            this.winstonLogger.info(coloredMessage);
        }
    }

    public info(message: string): void {
        this.winstonLogger.info(message);
    }

    public error(message: string): void {
        this.winstonLogger.error(message);
    }

    public warn(message: string): void {
        this.winstonLogger.warn(message);
    }

    public success(message: string): void {
        this.winstonLogger.info(colors.success(message));
    }
}

// Create and export a singleton instance of the Logger
export const logger = new Logger();

// Legacy function for backward compatibility
export const log = (message: string, colorType: LogColor): void => {
    logger.log(message, colorType);
};
