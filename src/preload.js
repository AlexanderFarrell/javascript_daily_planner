const {app, BrowserWindow} = require('electron');
const path = require('path');

let window;

function createWindow() {
    window = new BrowserWindow({
        width: 800,
        height: 600,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    window.webContents.openDevTools();

    window.loadFile(path.join(__dirname, '../content/index.html'));
}
app.on('ready', createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})
app.on('activate', () => {
    if (mainWindow == null) {
        createWindow();
    }
})