import {Injectable} from '@angular/core';

import {ipcRenderer, webFrame, dialog, webContents} from 'electron';
// import * as remote from '@electron/remote';
import * as childProcess from 'child_process';
import * as fs from 'fs';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  dialog: typeof dialog;
  // remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  Vault: typeof Vault;

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  constructor() {
    // Conditional imports
    if (this.isElectron) {
      const electron = window.require('electron');
      const remote  = window.require('@electron/remote');
      this.ipcRenderer = electron.ipcRenderer;
      this.webFrame = electron.webFrame;
      this.dialog = remote.dialog;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.Vault = window.require("ansible-vault").Vault;

      // If you want to use a NodeJS 3rd party deps in Renderer process (like @electron/remote),
      // it must be declared in dependencies of both package.json (in root and app folders)
      // If you want to use remote object in renderer process, please set enableRemoteModule to true in main.ts
      // this.remote = window.require('@electron/remote');
    }
  }
}
