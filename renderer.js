/* #region  Variables */
const { ipcRenderer, dialog } = require('electron');
const EditorJS = require('./editor.js');
const fs = require('fs');
const path = require('path');

const buttonquit = document.getElementById('buttonquit');
const buttontree = document.getElementById('buttontree');
const editorfield = document.getElementById('editorjs');
let editor = null;
let noteID = 0;
const saveDir = __dirname + '\\notes';
let noteDir = saveDir + '\\sn_' + noteID + '.json';
/* #endregion */





/* #region  Main */
createEditor();
/* #endregion */





/* #region  Events */
buttonquit.addEventListener('click', () => {
  finalizeNote();
  ipcRenderer.send('quitapp')
});



buttontree.addEventListener('click', () => {
  finalizeNote();
  //ipcRenderer.send('opentree')
});
/* #endregion */





/* #region  Note Editor */

// Called when initializing a note. 
function createEditor() {

  // Initialize editor.
  editor = new EditorJS({
    placeholder: "Sticky Nodes by Kadir Lofca.",
    autofocus: false,
    inlineToolbar: false,

    // Called when something changes in the editor (key added, deleted etc).
    onChange: (api, event) => {
      // Note sizes are small so every single change is saved without the need of optimization.
      saveNote();
    }
  });

  // Create saved data directory if doesn't exist.
  try {
    if (!fs.existsSync(saveDir)) {
      fs.mkdir(saveDir, (error) => {console.log('fs.mkdir failed: ' + error); ipcRenderer.send('quitapp')});
    }
  } catch(err) {
    console.error('fs.existsSync failed: ' + err)
    ipcRenderer.send('quitapp');
  }
}



// Called when a change is made to the note.
function saveNote() {

  // Get data from editor as json (outputData).
  editor.save().then((outputData) => {

    // Write the json into the file.
    fs.writeFile(noteDir, JSON.stringify(outputData), (err) => {
      if (err) { console.log('fs.writeFile failed: ' + err)}
    });

  }).catch((error) => {
    console.log('Editorjs.save failed: ', error)
  });
}



// Called to delete note entirely from saveDir.
function deleteNote() {
  if(fs.existsSync(saveDir + '\\sn_' + noteID)){
       fs.unlink(saveDir + '\\sn_' + noteID, (error) => {console.log('fs.unlink failed: ' + error);});
  }
}



// Called to check if the text editor is empty or not.
function isEmpty(){
  var output = null;
  editor.save().then((outputData) => {
    output = outputData;
  }).catch((error) => {
    console.log('Editorjs.save failed: ', error)
  });

  var t = JSON.parse(JSON.stringify(output));
  return (!Array.isArray(t) || !Array.isArray(t['blocks']) || !t['blocks'].length);
}



// Called when the note page is being exited, or the app is quitted.
function finalizeNote(){
  console.log(isEmpty());
  if(isEmpty() == true){
    //Check if note has children, delete if no children.
    deleteNote();
    console.log('deleted');
  }
  else{
    saveNote();
    console.log('saved');
  }
}
/* #endregion */