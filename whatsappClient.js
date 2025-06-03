const { Client, LocalAuth } = require('whatsapp-web.js');
const os = require('os');

const sessionIds = ['9540215846'];
const clients = {};

console.log("🔄 Initializing WhatsApp sessions...");

// ✅ Function to get Chrome/Chromium path based on OS
function getChromeExecutablePath() {
  const platform = os.platform();
  console.log(`🖥️ Detected platform: ${platform}`);

  if (platform === 'win32') {
    console.log("📍 Using Chrome path for Windows");
    return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  } else if (platform === 'darwin') {
    console.log("📍 Using Chrome path for macOS");
    return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  } else {
    console.log("📍 Using Chrome path for Linux");
    return '/usr/bin/google-chrome';
  }
}

const chromePath = getChromeExecutablePath();
console.log(`🔧 Chrome executable path: ${chromePath}`);

sessionIds.forEach(id => {
  console.log(`🚀 Starting session for: ${id}`);

  const client = new Client({
    authStrategy: new LocalAuth({ clientId: id }),
    puppeteer: {
      headless: true,
      executablePath: chromePath,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  });


  client.on('ready', () => {
    console.log(`✅ WhatsApp client ${id} is ready`);
  });

  client.on('auth_failure', msg => {
    console.error(`❌ Authentication failure for ${id}:`, msg);
  });

  client.on('disconnected', reason => {
    console.warn(`⚠️ Disconnected ${id}:`, reason);
  });

  client.on('loading_screen', (percent, message) => {
    console.log(`⏳ ${id} loading: ${percent}% - ${message}`);
  });

  client.on('authenticated', () => {
    console.log(`🔐 Authenticated successfully for ${id}`);
  });

  client.initialize();
  clients[id] = client;
});

module.exports = { clients, sessionIds };
