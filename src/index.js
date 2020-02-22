const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const ipc = electron.ipcRenderer;

const targetPrice = document.getElementById('targetPrice');
let targetPriceVal = 0;

const imgsLinks = document.querySelectorAll('.imgChoose');
const btnDelete = document.querySelectorAll('.imgDelete');

btnDelete.forEach(btn => {
   btn.addEventListener('click', function(event) {
      console.log(event.target.id);
      ipcRenderer.send('my-closeallwindowsasap-channel', event.target.id);
   });
});

imgsLinks.forEach(btn => {
   btn.addEventListener('click', function(event) {
      const modalPath = path.join('file://', __dirname, 'add.html');
      let win = new BrowserWindow({
         webPreferences: {
            nodeIntegration: true
         },
         frame: false,
         alwaysOnTop: true,
         width: 600,
         height: 600
      });
      win.on('close', function() {
         win = null;
      });
      win.webContents.openDevTools();
      win.loadURL(modalPath);
      win.show();
   });
});

ipc.on('targetPriceVal', function(event, arg) {
   targetPriceVal = Number(arg);
   targetPrice.innerHTML = targetPriceVal.toLocaleString('fr') + '€';
});
ipc.on('newAffiche', function(event, arg) {
   console.log(
      (document.getElementById('imgEntree').src = `../assets/images/${arg}.png`)
   );
});
