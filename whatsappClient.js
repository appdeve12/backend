




const { Client, LocalAuth } = require('whatsapp-web.js');

const sessionIds = ['9540215846'];  
const clients = {};

sessionIds.forEach(id => {
const client = new Client({
  authStrategy: new LocalAuth({ clientId: id }),
  puppeteer: {
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    userDataDir: `/tmp/chrome_profile_${id}`,  // Temp dir to isolate session
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});


  client.on('ready', () => console.log(`✅ WhatsApp client ${id} ready`));
  client.on('auth_failure', () => console.log(`❌ WhatsApp client ${id} auth failed`));
  client.initialize();

  clients[id] = client;
});

module.exports = { clients, sessionIds };
