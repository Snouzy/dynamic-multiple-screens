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
const remote = require('electron').remote;
const BrowserWindow = electron.remote.BrowserWindow;
const ipc = electron.ipcRenderer;
const imgsLinks = document.querySelectorAll('.imgChoose');
const btnDelete = document.querySelectorAll('.imgDelete');
let imgClicked = '';

ipc.on('changingURL', function(event, arg) {
   console.log(arg);
});

ipc.on('message', (event, message) => {
   console.log(message);
});

//Clique sur le bouton supprimer
document.querySelectorAll('.btnDelete').forEach(btn => {
   btn.addEventListener('click', function() {
      // ENTREE
      BrowserWindow.getAllWindows().forEach(el => {
         if (this.id === 'btnDelete-entree') {
            console.log('rentré dans le this.id ok');
            console.log(entreeThumbnail.src);
            console.log(entreeThumbnail.getAttribute('data-image'));
            if (
               entreeThumbnail.getAttribute('data-image') === 'affiche_pablo'
            ) {
               console.log('rentrée dans le .Src');
               if (el.getTitle() === 'Détaxe & Taxe refund') {
                  el.close();
                  entreeThumbnail.style.display = `none`;
                  entreeMainText.style.display = `block`;
                  entreeInfoText.innerHTML = 'Aucun';
               }
            }
            if (
               entreeThumbnail.getAttribute('data-image') === 'acces_interdit2'
            ) {
               if (el.getTitle() === 'Accès Interdit') {
                  el.close();
                  entreeThumbnail.style.display = `none`;
                  entreeMainText.style.display = `block`;
                  entreeInfoText.innerHTML = 'Aucun';
               }
            }
         }
         if (this.id === 'btnDelete-borne-pablo') {
            if (pabloThumbnail.getAttribute('data-image') === 'affiche_pablo') {
               console.log('rentrée dans le .Src');
               if (el.getTitle() === 'Détaxe & Taxe refund') {
                  el.close();
                  pabloThumbnail.style.display = `none`;
                  pabloMainText.style.display = `block`;
                  pabloInfoText.innerHTML = 'Aucun';
               }
            }
            if (
               pabloThumbnail.getAttribute('data-image') === 'acces_interdit2'
            ) {
               if (el.getTitle() === 'Accès Interdit') {
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
      win.loadURL(modalPath);
      win.on('close', function() {
         win = null;
      });
      imgClicked = this.id;
      ipc.send('add-img', this.id);
      win.show();
      win.webContents.openDevTools();
   });
});
ipc.on('img-added', function() {
   console.log('capturing img-added on index.js');
});

/* Gère les thumbnails */
ipc.on('newAffiche', function(event, arg) {
   /* LIGNE ENTREE  */
   if (arg === 'affiche_pablo' && imgClicked === 'imgChoose-entree') {
      entreeThumbnail.src = `../assets/images/${arg}.png`;
      entreeThumbnail.style.display = `block`;
      entreeThumbnail.setAttribute('data-image', arg);
      entreeInfoText.innerHTML = arg;
      entreeMainText.style.display = `none`;
      entreeThumbnail.style.width = `15rem`;
   }
   if (arg === 'acces_interdit2' && imgClicked === 'imgChoose-entree') {
      entreeThumbnail.src = `../assets/images/${arg}.png`;
      entreeThumbnail.style.display = `block`;
      entreeThumbnail.setAttribute('data-image', arg);
      entreeThumbnail.style.width = `8rem`;
      entreeInfoText.innerHTML = arg;
      entreeMainText.style.display = `none`;
   }
   /* LIGNE PABLO  */
   if (arg === 'affiche_pablo' && imgClicked === 'imgChoose-borne-pablo') {
      pabloThumbnail.src = `../assets/images/${arg}.png`;
      pabloThumbnail.style.display = `block`;
      pabloThumbnail.setAttribute('data-image', arg);
      pabloThumbnail.style.width = `15rem`;
      pabloInfoText.innerHTML = arg;
      pabloMainText.style.display = `none`;
   }
   if (arg === 'acces_interdit2' && imgClicked === 'imgChoose-borne-pablo') {
      console.log(arg);
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
