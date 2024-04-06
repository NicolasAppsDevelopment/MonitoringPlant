import { Logger, createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import chalk from "chalk";

// gloabal declaration for main process ONLY !
export declare let logger: Logger;

export function initLogger() {
    logger = createAppLogger();
}

const levelColor = (level: string) => {
    let gap = 0;
    switch (level) {
        case 'error': {
            level = chalk.red('ERROR');
            gap = 2;
            break;
        }

        case 'warn': {
            level = chalk.hex('#FFA500')('WARNING');
            break;
        }

        case 'info': {
            level = chalk.cyanBright('INFO');
            gap = 3;
            break;
        }

        default: {
            level = 'VERBOSE';
            break;
        }
    }

    return {
        level,
        gap
    };
}
const { printf } = format;
const logFormat = printf(({ level, message, timestamp }) => {
    const levelColored = levelColor(level);

    return `${
        chalk
            .bold
            .whiteBright(timestamp)
    }\t[${levelColored.level}]${' '.repeat(levelColored.gap)} : ${message}`;
});

export const createAppLogger = (): Logger => {
    let logger_path = process.cwd() + '/logs/';
    let logger = createLogger({
        format: format.combine(
            format.timestamp({
                format: 'DD/MM/YYYY HH:mm:ss'
            }),
            format.errors({ stack: true }),
            format.splat(),
            format.json()
        ),
        defaultMeta: { service: 'App' },
        transports: [
            new transports.File({ filename: logger_path + 'error.log', level: 'error' }),
            new transports.File({ filename: logger_path + 'combined.log' }),
            new DailyRotateFile({
                filename: logger_path + 'app-combined-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                maxSize: '1m',
            }),
        ],
        exceptionHandlers: [
            new transports.File({ filename: logger_path + 'exceptions.log' })
        ]
    });

    if (process.env.NODE_ENV !== 'production') {
        logger.add(new transports.Console({
            format: format.combine(
                format.timestamp({
                    format: 'DD/MM/YYYY HH:mm:ss'
                }),
                logFormat
            )
        }));
    }

    return logger;
}