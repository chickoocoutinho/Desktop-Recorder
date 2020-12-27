const { contextBridge, ipcRenderer, desktopCapturer, dialog } = require("electron");
const fs = require("fs");
const i18nextBackend = require("i18next-electron-fs-backend");
const Store = require("secure-electron-store").default;
const ContextMenu = require("secure-electron-context-menu").default;

// Create the electron store to be made available in the renderer process
const store = new Store();

const getVideoSources= new Promise(async (resolve,reject)=>{
  desktopCapturer.getSources({ 
    types: ['window', 'screen'],    
    fetchWindowIcons: true
  })
  .then(response=>resolve(response))
  .catch(err=>reject(err))
});

const saveRecordedFile= async (data)=>{
  const blob= new Blob(data,{
    type: 'video/webm; codecs=vp9'
  });

  const buffer = Buffer.from( await blob.arrayBuffer() );

  const filePath= await dialog.showSaveDialog({
    buttonLabel: 'Save Video',
    defaultPath: `vid-${Date().now()}.webm`
  })
  if( typeof(filePath) !== 'undefined' )
    fs.writeFile(filePath,buffer,()=>console.log('hooryyy'))
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  i18nextElectronBackend: i18nextBackend.preloadBindings(ipcRenderer),
  store: store.preloadBindings(ipcRenderer, fs),
  contextMenu: ContextMenu.preloadBindings(ipcRenderer),
  getVideoSources,
  saveRecordedFile

});
