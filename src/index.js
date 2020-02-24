//FIRST LINE
const nbOfDisplaySpan = document.getElementById('numberOfDisplays');
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
let rowClicked = '';
let win;
let modalPath;

//Clique sur le bouton fermer tous les affichages
document.querySelector('.btnReload').addEventListener('click', function() {
   BrowserWindow.getAllWindows().forEach(el => {
      if (el.getTitle() !== remote.getCurrentWindow().getTitle()) {
         el.close();
      }
   });
   ipc.send('reload');
});

const deleteInfos = (imgElt, mainText, infoText, eltToClose) => {
   eltToClose.close();
   imgElt.setAttribute('data-image', '');
   imgElt.style.display = 'none';
   mainText.style.display = 'block';
   infoText.innerHTML = 'Aucun';
};

// Clic sur le bouton supprimer
document.querySelectorAll('.btnDelete').forEach(btn => {
   btn.addEventListener('click', function() {
      // update le nb de displays
      if (nbOfDisplaySpan.innerHTML == 0) return;
      else nbOfDisplaySpan.innerHTML = BrowserWindow.getAllWindows().length - 2;

      // get the infos of what was clicked
      ipc.send('capturing-supprimerAffichage-click', this.id);
      const readResponse = ipc.sendSync('read-infos');
      console.log('read response = ', readResponse);

      BrowserWindow.getAllWindows().forEach(el => {
         // LIGNE ENTREE CLIQUEE
         let dataImg;
         if (this.id === 'btnDelete-entree') {
            dataImg = entreeThumbnail.getAttribute('data-image');
            if (el.getTitle() === dataImg && el.getPosition()[0] < 0) {
               deleteInfos(entreeThumbnail, entreeMainText, entreeInfoText, el);
            }
         } else {
            //LIGNE PABLO CLIQUEE
            dataImg = pabloThumbnail.getAttribute('data-image');
            if (el.getTitle() === dataImg && el.getPosition()[0] > 0) {
               deleteInfos(pabloThumbnail, pabloMainText, pabloInfoText, el);
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
   document.getElementById('numberOfDisplays').innerHTML = BrowserWindow.getAllWindows().length - 2;
   /* LIGNE ENTREE  */
   if (arg === 'affiche_pablo' && rowClicked === 'imgChoose-entree' && entreeThumbnail.getAttribute('data-image') !== arg) {
      entreeThumbnail.src = `../assets/images/${arg}.png`;
      entreeThumbnail.style.display = `block`;
      entreeThumbnail.setAttribute('data-image', arg);
      entreeInfoText.innerHTML = arg;
      entreeMainText.style.display = `none`;
      entreeThumbnail.style.width = `15rem`;
   }
   if (arg === 'parking' && rowClicked === 'imgChoose-entree') {
      entreeThumbnail.src = `../assets/images/${arg}.png`;
      entreeThumbnail.style.display = `block`;
      entreeThumbnail.setAttribute('data-image', arg);
      entreeThumbnail.style.width = `8rem`;
      entreeInfoText.innerHTML = arg;
      entreeMainText.style.display = `none`;
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
   if (arg === 'parking' && rowClicked === 'imgChoose-borne-pablo') {
      pabloThumbnail.src = `../assets/images/${arg}.png`;
      pabloThumbnail.style.display = `block`;
      pabloThumbnail.setAttribute('data-image', arg);
      pabloThumbnail.style.width = `8rem`;
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
