const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');

const sessionIds = ['9540215846'];
const clients = {};

sessionIds.forEach(id => {
const client = new Client({
  authStrategy: new LocalAuth({ clientId: id }),
  puppeteer: {
    headless: true,
    executablePath: '/usr/bin/chromium-browser', // Or '/usr/bin/chromium'
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});


  client.on('ready', () => console.log(`✅ WhatsApp client ${id} ready`));
  client.on('auth_failure', msg => console.error(`❌ WhatsApp client ${id} auth failed: ${msg}`));
  client.on('disconnected', reason => console.warn(`⚠️ WhatsApp client ${id} disconnected: ${reason}`));
  
  client.initialize();

  clients[id] = client;
});

module.exports = { clients, sessionIds };
