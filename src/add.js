const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const imgs = document.querySelectorAll('img');
let win;

deleteOldWindows = object => {
   BrowserWindow.getAllWindows().forEach(el => {
      if (object.rowClicked === 'entree') {
         if (el.getTitle() === object.entree.src) {
            el.close();
         }
      } else {
         if (el.getTitle() === object.borne.src) {
            el.close();
         }
      }
   });
};
imgs.forEach(img => {
   img.addEventListener('click', function(event) {
      const readResponse = ipc.sendSync('read-infos');
      console.log('read response = ', readResponse);
      // Supprime les vieilles fenêtres BrowserWindow
      deleteOldWindows(readResponse);
      // Update le main
      const response = ipc.sendSync('getAndUpdateInfos', this.id);
      console.log(response);

      // Prépare le positionnement à gauche ou à droite en fonction de l'id
      let positionOfTheDisplay;
      if (response.rowClicked === 'entree') {
         positionOfTheDisplay = -Math.abs(screen.width);
      } else {
         positionOfTheDisplay = screen.width;
      }

      let window = remote.getCurrentWindow();
      let modalPath;
      // S'il y a déjà un affichage

      win = new BrowserWindow({
         title: 'fullscreen-img',
         webPreferences: {
            nodeIntegration: true
         },
         frame: true,
         alwaysOnTop: false,
         width: screen.width,
         height: screen.height,
         x: positionOfTheDisplay,
         y: 0
      });
      win.webContents.openDevTools();

      modalPath = path.join('file://', __dirname, `${this.id}.html`);

      win.loadURL(modalPath);
      win.show();
      win.webContents.on('did-finish-load', () => {
         ipc.send('affiche-ajoutee', this.id);
         window.close();
      });
   });
});
