const electron = require('electron');
const ipc = electron.ipcRenderer;

ipc.on('changingURL', function(event, arg) {
   console.log(arg);
   console.log(document.querySelector('.container-fullImg-detaxe'));
});
console.log('hello');
