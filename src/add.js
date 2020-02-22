const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const remote = electron.remote;
// const ipc = electron.ipcRenderer;
const closeBtn = document.getElementById('closeBtn');
const imgs = document.querySelectorAll('img');
const { ipcRenderer } = require('electron');
const ipc = require('electron').ipcMain; //test
// ipcRenderer.send('my-closeallwindowsasap-channel'); // envoi un evt pour fermer toutes les fenêtres
closeBtn.addEventListener('click', function(event) {
   console.log('clicked');
   var window = remote.getCurrentWindow();
   window.close();
});

const updateBtn = document.getElementById('updateBtn');

updateBtn.addEventListener('click', function() {
   ipc.send('update-notify-value', document.getElementById('notifyVal').value);
   const window = remote.getCurrentWindow();
   window.close();
});

imgs.forEach(img => {
   img.addEventListener('click', function(event) {
      let modalPath;
      let win;
      if (this.id === 'affiche_pablo') {
         modalPath = path.join('file://', __dirname, 'detaxe.html');
         ipcRenderer.send('affiche-ajoutee', 'affiche_pablo');
      }
      // console.log(BrowserWindow.getAllWindows());

      win = new BrowserWindow({
         webPreferences: {
            nodeIntegration: true
         },
         frame: false,
         alwaysOnTop: true,
         width: screen.width,
         height: screen.height
      });
      win.on('close', function() {
         win = null;
      });
      win.webContents.openDevTools();
      win.loadURL(modalPath);
      win.show();
   });
});
