const { contextBridge, ipcRenderer, desktopCapturer, dialog } = require("electron");
const fs = require("fs");
const i18nextBackend = require("i18next-electron-fs-backend");
const Store = require("secure-electron-store").default;
const ContextMenu = require("secure-electron-context-menu").default;

// Create the electron store to be made available in the renderer process
const store = new Store();

const getVideoSources= ()=>(
  desktopCapturer.getSources({ 
    types: ['window', 'screen'],    
  })
);

const saveRecordedFile= (data,filePath)=>new Promise((resolve,reject)=>{
    data = data.replace(/^data:(.*?);base64,/, ""); // <--- make it any type
    data = data.replace(/ /g, '+'); // <--- this is important
    fs.writeFile(filePath,data, 'base64' ,(err) => {
      if (err) reject();
      resolve();
    })  
});

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  i18nextElectronBackend: i18nextBackend.preloadBindings(ipcRenderer),
  store: store.preloadBindings(ipcRenderer, fs),
  contextMenu: ContextMenu.preloadBindings(ipcRenderer), 
  send: (channel, data) => {
      // whitelist channels
      let validChannels = ["get-file-path"];
      if (validChannels.includes(channel)) {
          ipcRenderer.send(channel, data);
      }
  },
  receive: (channel, func) => {
      let validChannels = ["receive-file-path"];
      if (validChannels.includes(channel)) {
          // Deliberately strip event as it includes `sender` 
          ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
  },
  getVideoSources,
  saveRecordedFile
});


