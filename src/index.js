const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const ipc = electron.ipcRenderer;

const targetPrice = document.getElementById('targetPrice');
let targetPriceVal = 0;

const imgsLinks = document.querySelectorAll('.imgChoose');
// function getBTC() {
// axios
//    .get(
//       'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=EUR'
//    )
//    .then(res => {
//       const cryptos = res.data.BTC.EUR;
//       price.innerHTML = cryptos.toLocaleString('fr') + '€';
//       console.log(targetPriceVal);
//       if (targetPrice.innerHTML != '' && targetPriceVal < res.data.BTC.EUR) {
//          const myNotification = new window.Notification(
//             notification.title,
//             notification
//          );
//       }
//    });
// }

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
      win.on('close', function() {
         win = null;
      });
      win.webContents.openDevTools();
      win.loadURL(modalPath);
      win.show();
   });
});

ipc.on('targetPriceVal', function(event, arg) {
   targetPriceVal = Number(arg);
   targetPrice.innerHTML = targetPriceVal.toLocaleString('fr') + '€';
});
