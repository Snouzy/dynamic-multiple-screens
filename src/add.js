const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const closeBtn = document.getElementById('closeBtn');
const imgs = document.querySelectorAll('img');
let win;
console.log('hello from the global ccontext');

// ipcRenderer.send('my-closeallwindowsasap-channel'); // envoi un evt pour fermer toutes les fenêtres
closeBtn.addEventListener('click', function(event) {
   console.log('clicked');
   var window = remote.getCurrentWindow();
   window.close();
});

ipc.on('testing', function(event, args) {
   console.log(args);
});

ipc.on('img-choosed', function(event, arg) {
   console.log('add.js - img-choosed declanché');
   console.log(arg);
});

imgs.forEach(img => {
   img.addEventListener('click', function(event) {
      let modalPath;
      if (this.id === 'affiche_pablo') {
         modalPath = path.join('file://', __dirname, 'detaxe.html');
         ipc.send('affiche-ajoutee', 'affiche_pablo');
      }
      if (this.id === 'acces_interdit2') {
         modalPath = path.join('file://', __dirname, 'accesInterdit.html');
         ipc.send('affiche-ajoutee', 'acces_interdit2');
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

// const updateBtn = document.getElementById('updateBtn');

// updateBtn.addEventListener('click', function() {
//    ipc.send('update-notify-value', document.getElementById('notifyVal').value);
//    const window = remote.getCurrentWindow();
//    window.close();
// });
