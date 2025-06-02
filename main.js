const { app, globalShortcut, clipboard, Menu, Tray, BrowserWindow } = require('electron');
const path = require('path');

// Configure keyboard delay

let disabled = false;
let tray = null;
let popupWindow = null;

function openTranslateWindow(s, t) {
  const text = clipboard.readText().trim();

  if (!text) {
    console.log('Clipboard is empty.');
    return;
  }

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

  popupWindow.loadURL("https://translate.google.com/?sl="+s+"&tl="+t+"&text=" + encodeURIComponent(text) + "&op=translate");
}

app.whenReady().then(() => {
  tray = new Tray(path.join(__dirname, 'icon.ico'));
  tray.setToolTip('Translate Selected');
  tray.setContextMenu(Menu.buildFromTemplate([{ role: 'quit' }]));

  globalShortcut.register('Alt+Shift+D', () => { disabled = !disabled });
  globalShortcut.register('Control+C+Q', () => { if (!disabled) { openTranslateWindow("es", "en"); }});
  globalShortcut.register('Control+C+W', () => { if (!disabled) { openTranslateWindow("en", "es"); }});
});

app.on('window-all-closed', (e) => {
  e.preventDefault();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

