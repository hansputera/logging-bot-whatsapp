import { Client, Image, SessionManager, Video } from 'gampang';
import FileManager from 'file-manager';
import { prisma } from '@/Database/prisma';
import { winstonLogger } from '@/Utils/logger';
import { rimraf } from 'rimraf';

export async function WhatsApp() {
	const sessionManager = new SessionManager('whatsapp_sessions', 'folder');
	const client = new Client(sessionManager, {
		qr: {
			store: 'web',
			options: {
				port: 3000,
			},
		},
		prefixes: ['>>'],
	});
	const fileManager = new FileManager('whatsapp_storages');

	client.command('rvo', async (ctx) => {
		if (!ctx.isFromMe) {
			return;
		}

		const replied = ctx.getReply();
		const viewOnceMessage = replied?.raw.message?.viewOnceMessageV2?.message;

		if (!viewOnceMessage) {
			return;
		}

		const [imageMessage, videoMessage] = [
			viewOnceMessage.imageMessage,
			viewOnceMessage.videoMessage,
			// viewOnceMessage.ptvMessage, TODO
		];

		if (imageMessage) {
			const image = new Image(imageMessage);
			const imgBuff = await image.retrieveFile('image');

			const filename = `${Date.now()}.jpg`;
			await fileManager.writeFile(filename, imgBuff);

			await prisma.photoOrVideoMessage.create({
				data: {
					sender: replied.authorNumber,
					jid: replied.raw.key.remoteJid ?? '-',
					mediaType: 'image',
					mediaUrl: `/storages/${filename}`,
				},
			});

			winstonLogger.info(
				`Photo has saved into ${filename}, RVO from ${replied.authorNumber}`,
			);
		}

		if (videoMessage) {
			const video = new Video(videoMessage);
			const videoBuff = await video.retrieveFile('image');

			const filename = `${Date.now()}.mp4`;
			await fileManager.writeFile(filename, videoBuff);

			await prisma.photoOrVideoMessage.create({
				data: {
					sender: replied.authorNumber,
					jid: replied.raw.key.remoteJid ?? '-',
					mediaType: 'video',
					mediaUrl: `/storages/${filename}`,
				},
			});

			winstonLogger.info(
				`Video has saved into ${filename}, RVO from ${replied.authorNumber}`,
			);
		}
	});

	// Check JID
	client.command('check-jid', async (ctx) => {
		await ctx.reply(`This chat jid is \`${ctx.raw.key.remoteJid}\``);
	});

	// Clearance
	client.command('clearance', async (ctx) => {
		if (!ctx.isFromMe) {
			return;
		}

		const isSuccess = await rimraf('whatsapp_storages/*');
		if (isSuccess) {
			const { count } = await prisma.photoOrVideoMessage.deleteMany({});
			await ctx.reply(`Successfuly clearance the storages, and deleted ${count} medias`);
		}
	});

	// TODO: add deleted/updated message logger

	await client.launch({});
}
