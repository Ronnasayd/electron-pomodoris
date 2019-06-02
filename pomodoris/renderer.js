// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require('electron')
const moment = require('moment')

$('.config').on('click', () => {
    console.log('Abrindo configurações');
    ipcRenderer.send('abrir-config');
})

