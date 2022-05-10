/* #region  Variables */
const { ipcRenderer, dialog } = require('electron');

const buttonquit = document.getElementById('buttonquit');
/* #endregion */

/* #region  Events */
buttonquit.addEventListener('click', () => {
  ipcRenderer.send('quitapp')
});

/* #endregion */
