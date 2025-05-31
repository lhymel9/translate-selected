const { app, globalShortcut, clipboard, Menu, Tray, BrowserWindow } = require('electron');
// const { translate } = require('@vitalets/google-translate-api');
const { keyboard, Key, mouse } = require("@nut-tree-fork/nut-js");
const path = require('path');

// Configure keyboard delay
keyboard.config.autoDelayMs = 100;

let disabled = false;
let tray = null;
let popupWindow = null;

function openTranslateWindow(translation, s, t) {
  if (popupWindow && !popupWindow.isDestroyed()) {
    popupWindow.close();
  }

  popupWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    show: true,
    alwaysOnTop: false,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  popupWindow.get

  popupWindow.loadURL("https://translate.google.com/?sl="+s+"&tl="+t+"&text=" + encodeURIComponent(translation) + "&op=translate");
}

/*
async function showPopup(translation) {
  const pos = mouse.getPosition()
    .then(pos => {
      // Estimate size based on text length
      const lines = translation.split('\n');
      const maxLineLength = Math.max(...lines.map(line => line.length));
      const width = Math.min(800, 8 * maxLineLength);
      const height = Math.min(600, lines.length * 10);

      if (popupWindow && !popupWindow.isDestroyed()) {
        popupWindow.close();
      }

      popupWindow = new BrowserWindow({
        width,
        height,
        x: pos.x + 10,
        y: pos.y + 10,
        frame: false,         // No OS window borders or buttons
        transparent: false,   // Optional — true if you want transparency
        resizable: false,     // Prevent resizing
        skipTaskbar: true,    // No taskbar icon
        alwaysOnTop: true,     // Keeps it floating above other windows
        webPreferences: {
          contextIsolation: true
        }
      });

      const escapedText = translation
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <body style="
            margin: 0;
            padding: 3px;
            font-family: monospace;
            background: #1e1e1e;
            color: #fff;
            overflow: hidden;
          ">${escapedText}</body>
        </html>`;
      const dataUrl = 'data:text/html;charset=UTF-8,' + encodeURIComponent(htmlContent);
      popupWindow.loadURL(dataUrl);

      popupWindow.webContents.on('did-finish-load', () => {
        popupWindow.webContents.executeJavaScript(`
          window.addEventListener('mousedown', function(e) {
            e.preventDefault();
            if (e.button === 1) window.close();
          });
        `);
      });
    }).catch(console.log);
}
*/

async function handleTranslateShortcut(shortcut) { // Te amo
  // Wait for clipboard to update
  await setTimeout(() => { // te amo
    const text = clipboard.readText().trim();

    if (!text) {
      console.log('Clipboard is empty.');
      return;
    }
    
    if (shortcut === "Z")
    {
      openTranslateWindow(text, "es", "en");
    }
    else if (shortcut === "X")
    {
      openTranslateWindow(text, "en", "es");
    }
      // showPopup("honey this is a really long answer number 20");
  }, 400);
}

app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, 'icon.ico'));
  tray.setToolTip('Clipboard Translator');
  tray.setContextMenu(Menu.buildFromTemplate([{ role: 'quit' }]));

  globalShortcut.register('Alt+Shift+D', () => { disabled = !disabled });
  globalShortcut.register('Control+C+Z', async () => { if (!disabled) { await handleTranslateShortcut('Z'); }});
  globalShortcut.register('Control+C+X', async () => { if (!disabled) { await handleTranslateShortcut('X'); }});
});

app.on('window-all-closed', (e) => {
  e.preventDefault(); // Don't quit when windows are closed
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
