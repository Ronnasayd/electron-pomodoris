// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.in
const { ipcRenderer } = require('electron')
module.exports = {
    save(object) {
        ipcRenderer.send('save', object)
    }
}
