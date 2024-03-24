"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppLogger = exports.initLogger = void 0;
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const chalk_1 = __importDefault(require("chalk"));
function initLogger() {
    exports.logger = (0, exports.createAppLogger)();
}
exports.initLogger = initLogger;
const levelColor = (level) => {
    let gap = 0;
    switch (level) {
        case 'error': {
            level = chalk_1.default.red('ERROR');
            gap = 2;
            break;
        }
        case 'warn': {
            level = chalk_1.default.hex('#FFA500')('WARNING');
            break;
        }
        case 'info': {
            level = chalk_1.default.cyanBright('INFO');
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
};
const { printf } = winston_1.format;
const logFormat = printf(({ level, message, timestamp }) => {
    const levelColored = levelColor(level);
    return `${chalk_1.default
        .bold
        .whiteBright(timestamp)}\t[${levelColored.level}]${' '.repeat(levelColored.gap)} : ${message}`;
});
const createAppLogger = () => {
    let logger_path = process.cwd() + '/logs/';
    let logger = (0, winston_1.createLogger)({
        format: winston_1.format.combine(winston_1.format.timestamp({
            format: 'DD/MM/YYYY HH:mm:ss'
        }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
        defaultMeta: { service: 'App' },
        transports: [
            new winston_1.transports.File({ filename: logger_path + 'error.log', level: 'error' }),
            new winston_1.transports.File({ filename: logger_path + 'combined.log' }),
            new winston_daily_rotate_file_1.default({
                filename: logger_path + 'app-combined-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                maxSize: '1m',
            }),
        ],
        exceptionHandlers: [
            new winston_1.transports.File({ filename: logger_path + 'exceptions.log' })
        ]
    });
    if (process.env.NODE_ENV !== 'production') {
        logger.add(new winston_1.transports.Console({
            format: winston_1.format.combine(winston_1.format.timestamp({
                format: 'DD/MM/YYYY HH:mm:ss'
            }), logFormat)
        }));
    }
    return logger;
};
exports.createAppLogger = createAppLogger;
