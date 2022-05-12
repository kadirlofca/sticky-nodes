console.time("start-timer");

const { app, BrowserWindow, ipcMain, globalShortcut  } = require('electron')
const path = require('path')
let mainWindow = null;

/* #region  Window */
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    width: 600,
    height: 750,
    frame: false,
    maximizable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      backgroundThrottling: false,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  
  mainWindow.setResizable(false);
  mainWindow.setAlwaysOnTop(true);
  mainWindow.setMenu(null);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('resize', () => {
    mainWindow.setAspectRatio(4 / 5);
  });

  const pop = globalShortcut.register('CommandOrControl+Q', () => {
    if(mainWindow.isAlwaysOnTop()){
      mainWindow.hide();
      mainWindow.setAlwaysOnTop(false);
    }
    else{
      mainWindow.show();
      mainWindow.focus();
      mainWindow.setAlwaysOnTop(true);
      mainWindow.webContents.send('appfocused');
    }
  })

  //Used to auto open dev tools for debugging
  mainWindow.openDevTools(); 

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

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})

// Quit app.
ipcMain.on('quitapp', (evt, arg) => {
  app.quit()
})

ipcMain.on('opentree', () => {
  mainWindow.loadURL(`file://${__dirname}/` + "tree.html")
})

/* #endregion */