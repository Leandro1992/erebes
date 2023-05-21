// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const path = require('path')
const express = require('express')
const api = express()
const apiPort = 3001;
const controllers = require('./controllers/controller');
controllers.initControllers(api);
global.messages = [];


api.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))
api.use('/', express.static(path.resolve(__dirname + '/front/build')));