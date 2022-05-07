// Modules to control application life and create native browser window
const {app, BrowserWindow, Tray, ipcMain, Menu} = require('electron')
const path = require('path')
let trayIcon = null

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
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
      preload: path.join(__dirname, 'preload.js')
    }
  })
  
  // On top of most things, ex. task manager will be on top of this.
  mainWindow.setAlwaysOnTop(true);

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

function createTrayIcon () {
  tray = new Tray('./assets/images/icon.png')
	
  const trayMenu = Menu.buildFromTemplate([
  { label: 'Default Nodes', type: 'radio' },
	{ label: 'All Hidden', type: 'radio' },
	{ type: 'separator' },
	{ label: 'Quit', type: 'normal', role: 'quit' }
  ])

  // Make a change to the context menu
  trayMenu.items[1].checked = true;

  // Call this again for Linux because we modified the context menu
  tray.setContextMenu(trayMenu);
  
  tray.on("click", ()=>{
    tray.popUpContextMenu();
});

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  createTrayIcon()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit()
})