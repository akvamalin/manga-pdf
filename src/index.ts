import { app, BrowserWindow } from 'electron';
import * as url from 'url';
import { join, resolve } from 'path';
import { mainWindowSize } from './options';

app.on('ready', () => {
  let mainWindow = new BrowserWindow(mainWindowSize);
  const file = url.format({
    protocol: 'file:',
    pathname: resolve('dist', 'app', 'index.html'),
    slashes: true
  });
  mainWindow.loadURL(file);
  mainWindow.on('closed', () => (mainWindow = null));
});
