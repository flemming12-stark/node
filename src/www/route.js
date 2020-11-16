const express = require('express');
const Router = express.Router({
    mergeParams: true
});

const createprofile = require('./action/create.js');
const updateprofile = require('./action/update.js');
const readprofile = require('./action/read.js');
const deleteprofile = require('./action/delete.js');
const login = require('./action/login.js');



Router.post('/create', createprofile);
Router.post('/login', login);
Router.post('/update', updateprofile);
Router.post('/viewprofile', readprofile);
Router.post('/delete', deleteprofile);

module.exports = Router;