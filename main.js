console.time("start-timer");

// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
let trayIcon = null

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    show: false,
    width: 200,
    height: 250,
	minWidth: 200,
	minHeight: 250,
	maxWidth: 400,
	maxHeight: 500,
	frame: false,
	maximizable: false,
	skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

mainWindow.on('resize', ()=>{
    mainWindow.setAspectRatio(4/5);
});

  // On top of most things, ex. task manager will be on top of this.
  mainWindow.setAlwaysOnTop(true);

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

    //Used to auto open dev tools for debugging
  //mainWindow.openDevTools();  
}

// Create window
app.whenReady().then(() => {
  createWindow()
  console.timeEnd("start-timer");
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit()
})

// Quit app.
ipcMain.on('quitapp', (evt, arg) => {
  app.quit()
})