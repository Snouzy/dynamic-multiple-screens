const { app, BrowserWindow, Menu } = require('electron');
const shell = require('electron').shell;
const ipc = require('electron').ipcMain;
let win;
function createWindow() {
   // Cree la fenetre du navigateur.
   win = new BrowserWindow({
      width: 1000,
      height: 600,
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
ipc.on('my-closeallwindowsasap-channel', (event, arg) => {
   BrowserWindow.getAllWindows().forEach(window => {
      window.close();
   });
});
