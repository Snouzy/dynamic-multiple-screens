const { app, BrowserWindow, Menu } = require('electron');
const shell = require('electron').shell;
const ipc = require('electron').ipcMain;
let win;
const { webContents } = require('electron');
function createWindow() {
   // Cree la fenetre du navigateur.
   win = new BrowserWindow({
      width: 1000,
      height: 900,
      webPreferences: {
         nodeIntegration: true
      }
   });

   // et charger le fichier index.html de l'application.
   win.loadFile('src/index.html');

   win.webContents.openDevTools();
   // Ouvre les DevTools.
}
// const menu = Menu.buildFromTemplate([
//    {
//       label: 'Menu',
//       submenu: [
//          { label: 'Adjust notification value' },
//          {
//             label: 'CoinMarketCap',
//             click() {
//                shell.openExternal('http://coinmarketcap.com');
//             }
//          },
//          { type: 'separator' },
//          {
//             label: 'Exit',
//             click() {
//                app.quit();
//             }
//          }
//       ]
//    },
//    {
//       label: 'Info'
//    }
// ]);
// Menu.setApplicationMenu(menu);

// Cette méthode sera appelée quant Electron aura fini
// de s'initialiser et prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quand cet événement est émit.
app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
   // Sur macOS, il est commun pour une application et leur barre de menu
   // de rester active tant que l'utilisateur ne quitte pas explicitement avec Cmd + Q
   if (process.platform !== 'darwin') {
      app.quit();
   }
});
app.on('new-window-for-tab', () => {
   console.log('new-window-for-tab');
});
app.on('activate', () => {
   // Sur macOS, il est commun de re-créer une fenêtre de l'application quand
   // l'icône du dock est cliquée et qu'il n'y a pas d'autres fenêtres d'ouvertes.
   if (win === null) {
      createWindow();
   }
});
ipc.on('update-notify-value', function(event, arg) {
   win.webContents.send('targetPriceVal', arg);
});

//Quand il reçoit la notification, il ferme tout.
ipc.on('closeallwindows', (event, arg) => {
   BrowserWindow.getAllWindows().forEach(window => {
      window.close();
   });
});

ipc.on('reload', function() {
   win.reload();
});
ipc.on('affiche-ajoutee', function(event, arg) {
   win.webContents.send('newAffiche', arg);
});

ipc.on('open-img', function(event, arg) {
   win.webContents.send('test', 'testing');
});

ipc.on('changeURL', function(event, arg) {
   console.log('captured changeURL');
   win.webContents.send('changingURL', arg);
});

let currentDisplay = {
   entree: {
      isDisplaying: false,
      src: ''
   },
   borne: {
      isDisplaying: false,
      src: ''
   }
};
// Au clic sur Choisir une image...
ipc.on('capturing-click', function(event, arg) {
   console.log('Capturing the click : ', arg);
   switch (arg) {
      case 'imgChoose-entree':
         currentDisplay.entree.isDisplaying = true;
         break;
      case 'imgChoose-borne-pablo':
         currentDisplay.borne.isDisplaying = true;
   }
   win.webContents.send('sending-click-ID-from-main', arg);
});

// Donne l'image cliquée récupéréer depuis capturing-click
// FROM index.js et le rend TO add.js
ipc.on('message-synchrone-getImg', (event, arg) => {
   event.returnValue = currentDisplay;
});
