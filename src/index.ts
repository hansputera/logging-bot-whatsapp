import avvio from 'avvio';
import { RestApp } from '@/Apps/rest.js';
import { winstonLogger } from '@/Utils/logger.js';
import { WhatsApp } from '@/Apps/whatsapp.js';

const app = avvio();

app.use(RestApp);
app.use(WhatsApp);

app.ready(() => {
	winstonLogger.info('All apps are ready');
});
