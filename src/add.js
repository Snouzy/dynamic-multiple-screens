const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const imgs = document.querySelectorAll('img');
let win;

/**
 * Delete the old window before displaying the new one
 * @param  { object } response - Sended by the main process
 */
const deleteOldWindows = response => {
   BrowserWindow.getAllWindows().forEach(el => {
      if (response.rowClicked === 'entree') {
         if (el.getTitle() === response.entree.src) {
            el.close();
         }
      } else {
         if (el.getTitle() === response.borne.src) {
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

      // Update le main avec la nouvelle image
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

      win = new BrowserWindow({
         title: 'fullscreen-img',
         webPreferences: {
            nodeIntegration: true
         },
         frame: false,
         alwaysOnTop: true,
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
