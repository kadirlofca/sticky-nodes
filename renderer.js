// Quit
const {ipcRenderer} = require('electron');
const buttonquit = document.getElementById('buttonquit');
const buttontree = document.getElementById('buttontree');
const editorfield = document.getElementById('editorjs');
const EditorJS = require('./editor.js');

buttonquit.addEventListener('click', () => {
    ipcRenderer.send('quitapp')
});

buttontree.addEventListener('click', () => {
  ipcRenderer.send('opentree')
});

function createEditor(){
  const editor = new EditorJS({
    placeholder: "Sticky Nodes by Kadir Lofca.",
    autofocus: false
  });
}

createEditor();