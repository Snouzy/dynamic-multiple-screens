/* 
=============== 
ENTREE LINE
=============== */
const entreeThumbnail = document.getElementById('entree-thumbnail');
const entreeInfoText = document.getElementById('entree-info-text');
const entreeMainText = document.getElementById('entree-main-text');
/* 
=============== 
PABLO LINE
=============== */
const pabloThumbnail = document.getElementById('pablo-thumbnail');
const pabloInfoText = document.getElementById('pablo-info-text');
const pabloMainText = document.getElementById('pablo-main-text');

/* 
=============== 
GENERAL 
=============== */
const electron = require('electron');
const path = require('path');
const remote = electron.remote;
const BrowserWindow = electron.remote.BrowserWindow;
const ipc = electron.ipcRenderer;
const imgsLinks = document.querySelectorAll('.imgChoose');
const btnDelete = document.querySelectorAll('.imgDelete');
let rowClicked = '';
let win;
let modalPath;

ipc.on('changingURL', function(event, arg) {
   console.log(arg);
});
//Clique sur le bouton fermer tous les affichages
document.querySelector('.btnReload').addEventListener('click', function() {
   BrowserWindow.getAllWindows().forEach(el => {
      if (el.getTitle() !== remote.getCurrentWindow().getTitle()) {
         el.close();
      }
   });
   ipc.send('reload');
});

//Clique sur le bouton supprimer
document.querySelectorAll('.btnDelete').forEach(btn => {
   btn.addEventListener('click', function() {
      const readResponse = ipc.sendSync('read-infos');
      console.log('read response = ', readResponse);

      //Nombre d'affichage
      document.getElementById('numberOfDisplays').innerHTML =
         BrowserWindow.getAllWindows().length - 2;
      ipc.send('capturing-supprimerAffichage-click', this.id);
      // ENTREE
      BrowserWindow.getAllWindows().forEach(el => {
         if (this.id === 'btnDelete-entree') {
            if (
               entreeThumbnail.getAttribute('data-image') === 'affiche_pablo'
            ) {
               entreeThumbnail.setAttribute('data-image', '');
               if (el.getTitle() === 'affiche_pablo') {
                  el.close();

                  entreeThumbnail.style.display = `none`;
                  entreeMainText.style.display = `block`;
                  entreeInfoText.innerHTML = 'Aucun';
               }
            }
            if (
               entreeThumbnail.getAttribute('data-image') === 'acces_interdit2'
            ) {
               if (el.getTitle() === 'acces_interdit2') {
                  el.close();
                  entreeThumbnail.style.display = `none`;
                  entreeMainText.style.display = `block`;
                  entreeInfoText.innerHTML = 'Aucun';
               }
            }
         }
         //BORNE
         if (this.id === 'btnDelete-borne-pablo') {
            if (pabloThumbnail.getAttribute('data-image') === 'affiche_pablo') {
               if (el.getTitle() === 'affiche_pablo') {
                  el.close();
                  pabloThumbnail.style.display = `none`;
                  pabloMainText.style.display = `block`;
                  pabloInfoText.innerHTML = 'Aucun';
               }
            }
            if (
               pabloThumbnail.getAttribute('data-image') === 'acces_interdit2'
            ) {
               if (el.getTitle() === 'acces_interdit2') {
                  el.close();
                  pabloThumbnail.style.display = `none`;
                  pabloMainText.style.display = `block`;
                  pabloInfoText.innerHTML = 'Aucun';
               }
            }
         }
      });
   });
});

//Au click sur "Choisir une image..." -> add.html / add.js
imgsLinks.forEach(btn => {
   btn.addEventListener('click', function(event) {
      modalPath = path.join('file://', __dirname, 'add.html');
      win = new BrowserWindow({
         webPreferences: {
            nodeIntegration: true
         },
         show: false,
         frame: true,
         alwaysOnTop: true,
         width: 600,
         height: 1000
      });

      win.setMenu(null);
      win.loadURL(modalPath);
      rowClicked = this.id;
      ipc.send('add-img', this.id);
      win.show();
      win.webContents.openDevTools();

      win.webContents.on('did-finish-load', () => {
         ipc.send('capturing-choisirImg-click', this.id);
      });

      win.on('close', function() {
         win = null;
      });
   });
});

ipc.on('sending-click-ID-from-main', () => {
   console.log('sending-click-ID-from-main received on index.js');
});
ipc.on('img-added', function() {
   console.log('capturing img-added on index.js');
});

/* Gère les thumbnails */
ipc.on('newAffiche', function(event, arg) {
   document.getElementById('numberOfDisplays').innerHTML =
      BrowserWindow.getAllWindows().length - 2;
   /* LIGNE ENTREE  */
   if (
      arg === 'affiche_pablo' &&
      rowClicked === 'imgChoose-entree' &&
      entreeThumbnail.getAttribute('data-image') !== arg
   ) {
      entreeThumbnail.src = `../assets/images/${arg}.png`;
      entreeThumbnail.style.display = `block`;
      entreeThumbnail.setAttribute('data-image', arg);
      entreeInfoText.innerHTML = arg;
      entreeMainText.style.display = `none`;
      entreeThumbnail.style.width = `15rem`;
   }
   if (arg === 'acces_interdit2' && rowClicked === 'imgChoose-entree') {
      entreeThumbnail.src = `../assets/images/${arg}.png`;
      entreeThumbnail.style.display = `block`;
      entreeThumbnail.setAttribute('data-image', arg);
      entreeThumbnail.style.width = `8rem`;
      entreeInfoText.innerHTML = arg;
      entreeMainText.style.display = `none`;
   }
   /* LIGNE PABLO  */
   if (arg === 'affiche_pablo' && rowClicked === 'imgChoose-borne-pablo') {
      pabloThumbnail.src = `../assets/images/${arg}.png`;
      pabloThumbnail.style.display = `block`;
      pabloThumbnail.setAttribute('data-image', arg);
      pabloThumbnail.style.width = `15rem`;
      pabloInfoText.innerHTML = arg;
      pabloMainText.style.display = `none`;
   }
   if (arg === 'acces_interdit2' && rowClicked === 'imgChoose-borne-pablo') {
      pabloThumbnail.src = `../assets/images/${arg}.png`;
      pabloThumbnail.style.display = `block`;
      pabloThumbnail.setAttribute('data-image', arg);
      pabloThumbnail.style.width = `8rem`;
      pabloInfoText.innerHTML = arg;
      pabloMainText.style.display = `none`;
   }
});

//Close the app
document.querySelector('.btnClose').addEventListener('click', function() {
   ipc.send('closeallwindows');
});
