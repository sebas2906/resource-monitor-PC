const { BrowserWindow } = require('electron');

class MainWindow extends BrowserWindow {
    constructor(file, isDev) {
        super({
            title: 'Monitor',
            width: isDev ? 700 : 500,
            height: 600,
            icon: './assets/icons/win/icon.ico',
            resizable: isDev ? true : false,
            show: false,
            opacity: 0.9,
            webPreferences: {
                nodeIntegration: true, //permite llevar modulos de node hacia el lado del frontend
                contextIsolation: false
            }
        });
        this.loadFile(file);
        if (isDev) {
            this.webContents.openDevTools();
        }
    }
}

module.exports = MainWindow;