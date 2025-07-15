
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@whiskeysockets/baileys');
const fs = require('fs');
const pino = require('pino');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        logger: pino({ level: 'silent' })
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, pairingCode } = update;
        if (pairingCode) {
            console.log("\n👉 Your Pairing Code:", pairingCode);
            fs.writeFileSync('pair-code.json', JSON.stringify({ pairingCode }, null, 2));
        }
        if(connection === 'open') {
            console.log("✅ BOT CONNECTED!");
            fs.writeFileSync('pair-code.json', JSON.stringify({ pairingCode: null }, null, 2));
        }
        if(connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
            console.log("Connection closed, reconnecting:", shouldReconnect);
            if(shouldReconnect) startBot();
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;
        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

        if (text.toLowerCase() === 'hi') {
            await sock.sendMessage(from, { text: '👋 Hello! This is your bot replying.' });
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

startBot();
