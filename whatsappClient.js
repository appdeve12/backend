const { Client, LocalAuth } = require('whatsapp-web.js');
const os = require('os');
const path = require('path');

// Sessions you want to run simultaneously
const sessionIds = ['7985490508', '9540215846'];
const clients = {};

// Function to get Chrome executable path based on OS
function getChromeExecutablePath() {
  const platform = os.platform();

  if (platform === 'win32') {
    return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  } else if (platform === 'darwin') {
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  } else {
    // Linux - default path for Chrome (e.g., on Ubuntu EC2)
    return '/usr/bin/google-chrome';
  }
}

// Initialize each session with separate Chrome profile data directory
sessionIds.forEach(id => {
  const chromeUserDataDir = path.join('/tmp', `chrome-profile-${id}`);

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: id }),
    puppeteer: {
      headless: true,
      executablePath: getChromeExecutablePath(),
      args: [
        `--user-data-dir=${chromeUserDataDir}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process',
        '--disable-extensions',
        '--disable-gpu'
      ]
    }
  });

  client.on('ready', () => console.log(`✅ WhatsApp client ${id} ready`));
  client.on('auth_failure', () => console.log(`❌ WhatsApp client ${id} auth failed`));
  client.on('disconnected', reason => console.log(`⚠️ WhatsApp client ${id} disconnected:`, reason));
  client.on('qr', qr => console.log(`📱 QR code for ${id}:\n${qr}`));

  client.initialize();
  clients[id] = client;
});

module.exports = { clients, sessionIds };
