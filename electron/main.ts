import { app, BrowserWindow, Menu } from 'electron';
import * as path from 'path';

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#0a0a0a', // Match dark theme background
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false,
  });

  // Load the app
  if (isDev) {
    // In development, load from Next.js dev server
    mainWindow.loadURL('http://localhost:9002');
  } else {
    // In production, load from the built Next.js app
    const fs = require('fs');
    const indexPath = path.join(__dirname, '../out/index.html');
    
    // Check if index.html exists, otherwise try to load the directory
    if (fs.existsSync(indexPath)) {
      mainWindow.loadFile(indexPath);
    } else {
      // If index.html doesn't exist, try loading the directory root
      mainWindow.loadURL(`file://${path.join(__dirname, '../out/index.html')}`);
    }
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle window closed
  mainWindow.on('close', (event) => {
    if (process.platform === 'darwin') {
      // On macOS, keep the app running when window is closed
      event.preventDefault();
      mainWindow?.hide();
    }
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  // macOS specific: Re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else {
      mainWindow?.show();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Create application menu
if (process.platform === 'darwin') {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: app.getName(),
      submenu: [
        { role: 'about' as const },
        { type: 'separator' as const },
        { role: 'services' as const },
        { type: 'separator' as const },
        { role: 'hide' as const },
        { role: 'hideOthers' as const },
        { role: 'unhide' as const },
        { type: 'separator' as const },
        { role: 'quit' as const },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' as const },
        { role: 'redo' as const },
        { type: 'separator' as const },
        { role: 'cut' as const },
        { role: 'copy' as const },
        { role: 'paste' as const },
        { role: 'selectAll' as const },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' as const },
        { role: 'forceReload' as const },
        { role: 'toggleDevTools' as const },
        { type: 'separator' as const },
        { role: 'resetZoom' as const },
        { role: 'zoomIn' as const },
        { role: 'zoomOut' as const },
        { type: 'separator' as const },
        { role: 'togglefullscreen' as const },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' as const },
        { role: 'close' as const },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
} else {
  // Windows/Linux menu
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        { role: 'quit' as const },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' as const },
        { role: 'redo' as const },
        { type: 'separator' as const },
        { role: 'cut' as const },
        { role: 'copy' as const },
        { role: 'paste' as const },
        { role: 'selectAll' as const },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' as const },
        { role: 'forceReload' as const },
        { role: 'toggleDevTools' as const },
        { type: 'separator' as const },
        { role: 'resetZoom' as const },
        { role: 'zoomIn' as const },
        { role: 'zoomOut' as const },
        { type: 'separator' as const },
        { role: 'togglefullscreen' as const },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Handle external links - open in default browser
app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== 'http://localhost:9002' && parsedUrl.origin !== 'file://') {
      event.preventDefault();
      require('electron').shell.openExternal(navigationUrl);
    }
  });
  
  contents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
});

