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

const saveRecordedFile= (data,filePath)=>new Promise(async (resolve,reject)=>{
  try{
    const blob= new Blob(data,{
      type: 'video/webm; codecs=vp9'
    });
    const buffer = Buffer.from( await blob.arrayBuffer() );
    await fs.promises.writeFile(filePath,buffer)  
    resolve()
  }
  catch{ 
    reject()
  }
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
