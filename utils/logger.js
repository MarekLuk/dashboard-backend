const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, errors, splat, colorize } = format;
const fs = require("fs");
const path = require("path");

const logFormat = combine(
	colorize(),
	timestamp({ format: "ss:mm:HH DD-MM-YYYY" }),
	errors({ stack: true }),
	splat(),
	printf(({ timestamp, level, message, stack }) => {
		return `${timestamp} [${level}]: ${stack || message}`;
	})
);

const useFileTransports = !process.env.VERCEL;

if (useFileTransports) {
	const logsDir = path.join(__dirname, "..", "logs");
	if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir, { recursive: true });
	}
}

const loggerTransports = [new transports.Console()];
if (useFileTransports) {
	loggerTransports.push(
		new transports.File({ filename: "logs/app.log", level: "info" })
	);
}

const exceptionHandlers = useFileTransports
	? [new transports.File({ filename: "logs/exceptions.log" })]
	: undefined;
const rejectionHandlers = useFileTransports
	? [new transports.File({ filename: "logs/rejections.log" })]
	: undefined;

const logger = createLogger({
	level: process.env.NODE_ENV === "production" ? "info" : "debug",
	format: logFormat,
	defaultMeta: { service: "Amazing app" },
	transports: [
		new transports.Console(),
		new transports.File({
			filename: "logs/app.log",
			level: "info",
		}),
	],
	exceptionHandlers: [new transports.File({ filename: "logs/exceptions.log" })],
	rejectionHandlers: [new transports.File({ filename: "logs/rejections.log" })],
});

module.exports = logger;
