const path = require('path');
const { app, Menu, ipcMain } = require('electron');
const Store = require('./Store');
const MainWindow = require('./MainWindow');
const AppTray = require('./AppTray');


//Set Env
//development
//production
process.env.NODE_ENV = 'production';

const isDev = process.env.NODE_ENV !== 'production' ? true : false;
const Win = process.platform === 'win32' ? true : false;


let mainWindow;

let tray;

//Init Store and defaults
const store = new Store({
    configName: 'user-settings',
    defaults: {
        settings: {
            cpuOverload: 80,
            alertFrequency: 5
        }
    }
});

function createMainWindow() {
    mainWindow = new MainWindow('./app/index.html', isDev)
}





app.on('ready', () => {
    createMainWindow();
    mainWindow.webContents.on('dom-ready', () => {
        mainWindow.webContents.send('settings:get', store.get('settings'));
    });
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);
    mainWindow.on('close', e => {
        if (!app.isQuitting) {
            e.preventDefault();
            mainWindow.hide();
        }
    })
    const icon = path.join(__dirname, 'assets', 'icons', 'win', 'icon.ico');
    //create tray
    tray = new AppTray(icon, mainWindow);

    /*  globalShortcut.register('Ctrl+R', () => mainWindow.reload());
     globalShortcut.register('Ctrl+D', () => mainWindow.toggleDevTools()); */
    mainWindow.on('ready', () => mainWindow = null);
});

//set settings
ipcMain.on('settings:set', (e, value) => {
    store.set('settings', value);
    mainWindow.webContents.send('settings:get', store.get('settings'));

});

const menu = [{
        role: 'fileMenu'
    },
    {
        label: 'View',
        submenu: [{
            label: 'Toggle Navigation',
            click: () => mainWindow.webContents.send('nav:toggle')
        }]
    },
    ...(isDev ? [{
        label: 'Developer',
        submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' }
        ]
    }] : []),

]