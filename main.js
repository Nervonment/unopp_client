const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720
    });

    // 加载应用----react 打包
    // mainWindow.loadURL(url.format({
    //     pathname: path.join(__dirname, '.'),
    //     protocol: 'file:',
    //     slashes: true
    // }))
    mainWindow.loadURL('file://' + __dirname + '/build/index.html')

    // react project
    //mainWindow.loadURL('http://localhost:3000');

    //mainWindow.on('closed', () => { mainWindow = null });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});