// général
const btnReload = document.querySelector('.btnReload');
const imgsLinks = document.querySelectorAll('.imgChoose');
const electron = require('electron');
const path = require('path');
const remote = electron.remote;
const BrowserWindow = electron.remote.BrowserWindow;
const ipc = electron.ipcRenderer;
let rowClicked = '';
let win;
let modalPath;

// ligne "affichage"
const nbOfDisplaySpan = document.getElementById('numberOfDisplays');

// ligne "entrée"
const entreeThumbnail = document.getElementById('entree-thumbnail');
const entreeInfoText = document.getElementById('entree-info-text');
const entreeMainText = document.getElementById('entree-main-text');

// ligne "pablo"
const pabloThumbnail = document.getElementById('pablo-thumbnail');
const pabloInfoText = document.getElementById('pablo-info-text');
const pabloMainText = document.getElementById('pablo-main-text');

//Clique sur le bouton "éteindre tous les affichages"
btnReload.addEventListener('click', () => {
   BrowserWindow.getAllWindows().forEach(el => {
      const currentTitle = remote.getCurrentWindow().getTitle();
      el.getTitle() !== currentTitle ? el.close() : null;
   });
   ipc.send('reload');
});

/**
 * Delete the infos in the dashboard
 * @param  { object } imgElt - HTMLElement
 * @param  { string } mainText - HTMLElement
 * @param  { string } infoText - HTMLElement
 * @param  { object } eltToClose - BrowserWindow element
 */
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

//Au click sur "Changer l'affichage..." -> go to add.html / add.js
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
         backgroundColor: '#1a1a1a',
         width: 600,
         height: 1000
      });

      win.setMenu(null);
      win.loadURL(modalPath);
      win.show();
      // win.webContents.openDevTools();
      rowClicked = this.id;
      ipc.send('add-img', rowClicked);

      win.webContents.on('did-finish-load', () => {
         ipc.send('capturing-choisirImg-click', this.id);
      });

      win.on('close', function() {
         win = null;
      });
   });
});

const updateInfos = (imgElt, infoText, mainText, argByMain) => {
   if (imgElt.getAttribute('data-image') !== argByMain) {
      let size;
      if (argByMain === 'affiche_pablo') size = '15rem';
      else size = '8rem';
      imgElt.src = `../assets/images/${argByMain}.png`;
      imgElt.style.display = 'block';
      imgElt.setAttribute('data-image', argByMain);
      imgElt.style.width = size;
      infoText.innerHTML = argByMain;
      mainText.style.display = 'none';
   }
};
/* Gère les thumbnails */
ipc.on('newAffiche', function(event, arg) {
   document.getElementById('numberOfDisplays').innerHTML = BrowserWindow.getAllWindows().length - 2;
   /* LIGNE ENTREE  */
   if (rowClicked === 'imgChoose-entree') {
      updateInfos(entreeThumbnail, entreeInfoText, entreeMainText, arg);
   } else {
      /* LIGNE PABLO  */
      updateInfos(pabloThumbnail, pabloInfoText, pabloMainText, arg);
   }
});

//Close the app
document.querySelector('.btnClose').addEventListener('click', function() {
   ipc.send('closeallwindows');
});
