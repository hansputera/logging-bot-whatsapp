import winston from 'winston';
import SentryTransport from 'winston-transport-sentry-node';

export const winstonLogger = winston.createLogger({
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.errors({
			stack: true,
		}),
		winston.format.prettyPrint({
			colorize: true,
		}),
		winston.format.simple(),
	),
	transports: [
		new winston.transports.Console({
			level: 'info',
		}),
		new SentryTransport({
			sentry: {
				dsn: process.env.SENTRY_DSN,
			},
		}),
	],
});
