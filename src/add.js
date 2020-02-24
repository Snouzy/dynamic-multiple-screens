const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const remote = electron.remote;
const ipc = electron.ipcRenderer;
const imgs = document.querySelectorAll('img');
let win;
imgs.forEach(img => {
   img.addEventListener('click', function(event) {
      const readResponse = ipc.sendSync('read-infos');
      console.log('read response = ', readResponse);
      // Supprime les vieilles fenêtres BrowserWindow
      BrowserWindow.getAllWindows().forEach(el => {
         if (readResponse.rowClicked === 'entree') {
            if (el.getTitle() === readResponse.entree.src) {
               el.close();
            }
         } else {
            if (el.getTitle() === readResponse.borne.src) {
               el.close();
            }
         }
      });
      const response = ipc.sendSync('getAndUpdateInfos', this.id);
      console.log(response);

      // Gauche ou droite ?
      let positioning;
      if (response.rowClicked === 'entree') {
         positioning = -Math.abs(screen.width);
      } else {
         positioning = screen.width;
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
         height: screen.height
      });
      win.webContents.openDevTools();

      modalPath = path.join('file://', __dirname, `${this.id}.html`);

      win.loadURL(modalPath);
      win.setPosition(positioning, 0);
      win.show();
      win.webContents.on('did-finish-load', () => {
         if (this.id === 'affiche_pablo') {
            ipc.send('affiche-ajoutee', this.id);
         }
         if (this.id === 'acces_interdit2') {
            ipc.send('affiche-ajoutee', this.id);
         }
         if (this.id === 'parking') {
            ipc.send('affiche-ajoutee', this.id);
         }

         window.close();
      });
   });
});

// const updateBtn = document.getElementById('updateBtn');

// updateBtn.addEventListener('click', function() {
//    ipc.send('update-notify-value', document.getElementById('notifyVal').value);
//    const window = remote.getCurrentWindow();
//    window.close();
// });
