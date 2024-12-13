const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors, splat, colorize } = format;

const logFormat = combine(
  colorize(),
  timestamp({ format: 'ss:mm:HH DD-MM-YYYY' }),
  errors({ stack: true }),
  splat(),
  printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
  })
);

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'Amazing app' },
  transports: [
    new transports.Console(),
    new transports.File({
      filename: 'logs/app.log',
      level: 'info',
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/rejections.log' }),
  ],
});

module.exports = logger;
