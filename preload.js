const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('contextmenu', (e) => {
  const selection = window.getSelection().toString();
  if (selection.trim().length > 0) {
    e.preventDefault();
    ipcRenderer.send('show-context-menu', selection);
  }
}, false);
