// Quit
const {ipcRenderer} = require('electron');
const buttonquit = document.getElementById('buttonquit');

buttonquit.addEventListener('click', () => {
    ipcRenderer.send('quitapp')
});