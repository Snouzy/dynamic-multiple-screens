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
const pabloThumbail = document.getElementById('pablo-thumbnail');
const pabloInfoText = document.getElementById('pablo-info-text');
const pabloMainText = document.getElementById('pablo-main-text');

/* 
=============== 
GENERAL 
=============== */
const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const ipc = electron.ipcRenderer;
const imgsLinks = document.querySelectorAll('.imgChoose');
const btnDelete = document.querySelectorAll('.imgDelete');
let imgClicked = '';
// btnDelete.forEach(btn => {
//    btn.addEventListener('click', function(event) {
//       console.log(event.target.id);
//       ipcRenderer.send('my-closeallwindowsasap-channel', event.target.id);
//    });
// });

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
      win.show();
      win.loadURL(modalPath);
      win.on('close', function() {
         win = null;
      });
      imgClicked = this.id;
      // win.webContents.once('dom-ready', () => {
      //    ipc.send('changing-image-clicked', this.id);
      // });
      win.webContents.openDevTools();
      console.log(imgClicked);
   });
});

// ipc.on('targetPriceVal', function(event, arg) {
//    targetPriceVal = Number(arg);
//    targetPrice.innerHTML = targetPriceVal.toLocaleString('fr') + '€';
// });

/* Gère les thumbnails */
ipc.on('newAffiche', function(event, arg) {
   /* LIGNE ENTREE  */
   if (arg === 'affiche_pablo' && imgClicked === 'imgChoose-entree') {
      entreeThumbnail.src = `../assets/images/${arg}.png`;
      entreeThumbnail.style.display = `block`;
      entreeInfoText.innerHTML = arg;
      entreeMainText.style.display = `none`;
      entreeThumbnail.style.width = `15rem`;
   }
   if (arg === 'acces_interdit2' && imgClicked === 'imgChoose-entree') {
      entreeThumbnail.src = `../assets/images/${arg}.png`;
      entreeThumbnail.style.display = `block`;
      entreeThumbnail.style.width = `8rem`;
      entreeInfoText.innerHTML = arg;
      entreeMainText.style.display = `none`;
   }
   /* LIGNE PABLO  */
   if (arg === 'affiche_pablo' && imgClicked === 'imgChoose-borne-pablo') {
      pabloThumbail.src = `../assets/images/${arg}.png`;
      pabloThumbail.style.display = `block`;
      pabloThumbail.style.width = `15rem`;
      pabloInfoText.innerHTML = arg;
      pabloMainText.style.display = `none`;
   }
   if (arg === 'acces_interdit2' && imgClicked === 'imgChoose-borne-pablo') {
      pabloThumbail.src = `../assets/images/${arg}.png`;
      pabloThumbail.style.display = `block`;
      pabloThumbail.style.width = `8rem`;
      pabloInfoText.innerHTML = arg;
      pabloMainText.style.display = `none`;
   }
});
