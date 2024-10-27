import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { winstonLogger } from '@/Utils/logger.js';

export async function RestApp() {
	const app = new Hono();

	app.get('/', async (ctx) => {
		return ctx.status(200);
	});

	serve(
		{
			fetch: app.fetch,
			port: Number.parseInt(process.env.PORT ?? '4000'),
		},
		(info) => {
			winstonLogger.info(`Server listening on ${info.address}:${info.port}`);
		},
	);
}
