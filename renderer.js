/* #region  Variables */
const { ipcRenderer, dialog } = require('electron');
const EditorJS = require('./editor.js');
const fs = require('fs');
const path = require('path');

const buttonquit = document.getElementById('buttonquit');
const buttontree = document.getElementById('buttontree');
const editorfield = document.getElementById('editorjs');
let editor = null;
/* #endregion */

/* #region  Events */
buttonquit.addEventListener('click', () => {
  ipcRenderer.send('quitapp')
});

buttontree.addEventListener('click', () => {
  ipcRenderer.send('opentree')
});
/* #endregion */

/* #region  Note Editor */

// Called when initializing a note. 
function createEditor() {

  // Create saved data directory if doesn't exist.
  try {
    if (!fs.existsSync(__dirname + "\\notes")) {
      fs.mkdir(__dirname + "\\notes", (error) => {console.log(error); ipcRenderer.send('quitapp')});
    }
  } catch(err) {
    console.error(err)
    ipcRenderer.send('quitapp');
  }

  // Initialize editor.
  editor = new EditorJS({
    placeholder: "Sticky Nodes by Kadir Lofca.",
    autofocus: false,
    inlineToolbar: false,

    onChange: (api, event) => {
      saveNote();
    }
  });
}

// Called when a change is made to the note.
function saveNote() {

  // Get data from editor as json (outputData).
  editor.save().then((outputData) => {

    // FIX THIS AND PUT INSIDE QUIT BUTTON EVENT.
    /*if(outputData[blocks] === null){
      fs.rmdir(__dirname, '\\notes\\test.json');
    }*/

    // Write the json into the file.
    fs.writeFile(path.join(__dirname, '\\notes\\test.json'), JSON.stringify(outputData), (err) => {
      if (err) { console.log(err)}
    });

  }).catch((error) => {
    console.log('Saving failed: ', error)
  });
}
/* #endregion */

/* #region  Main */
createEditor();
/* #endregion */