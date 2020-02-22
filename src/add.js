const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const closeBtn = document.getElementById('closeBtn');
const imgs = document.querySelectorAll('img');
let win;
let isPabloActive = false;
let acces_interdit2 = false;
console.log('hello from the global ccontext');

// global.windowAdd = 'windowADD';

// ipcRenderer.send('my-closeallwindowsasap-channel'); // envoi un evt pour fermer toutes les fenêtres
closeBtn.addEventListener('click', function(event) {
   var window = remote.getCurrentWindow();
   window.close();
});

imgs.forEach(img => {
   img.addEventListener('click', function(event) {
      let modalPath;
      //S'il y a déjà un affichage
      // if (isPabloActive) {
      //    ipc.send('changeURL', this.id);
      // } else {
      win = new BrowserWindow({
         title: 'fullscreen-img',
         webPreferences: {
            nodeIntegration: true
         },
         frame: true,
         alwaysOnTop: false,
         width: screen.width,
         height: screen.height
      });

      win.webContents.openDevTools();

      if (this.id === 'affiche_pablo') {
         isPabloActive = true;
         modalPath = path.join('file://', __dirname, 'detaxe.html');
         // ipc.send('affiche-ajoutee', 'affiche_pablo');
      }
      if (this.id === 'acces_interdit2') {
         acces_interdit2 = true;
         modalPath = path.join('file://', __dirname, 'accesInterdit.html');
         // ipc.send('affiche-ajoutee', 'acces_interdit2');
      }
      win.loadURL(modalPath);
      win.setPosition(1536, 0);
      win.show();

      win.webContents.on('did-finish-load', () => {
         if (this.id === 'affiche_pablo') {
            ipc.send('affiche-ajoutee', 'affiche_pablo');
         }
         if (this.id === 'acces_interdit2') {
            ipc.send('affiche-ajoutee', 'acces_interdit2');
         }
      });
      // BrowserWindow.getAllWindows().forEach(el => {
      //    if (el.getTitle() === 'Document') {
      //       el.close();
      //    }
      // });
      // }

      win.on('close', function() {
         win = null;
      });
   });
});

// const updateBtn = document.getElementById('updateBtn');

// updateBtn.addEventListener('click', function() {
//    ipc.send('update-notify-value', document.getElementById('notifyVal').value);
//    const window = remote.getCurrentWindow();
//    window.close();
// });
