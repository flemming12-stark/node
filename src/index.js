fs = require('fs');
mysql = require('mysql');
async = require('async');
request = require('request');
const express = require('express');
dateFormat = require('dateformat');

require('./db/dbdetails.js');
process.on('uncaughtException', function (err) {
    console.log(err);
}); 
app = express();
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	req.start = new Date();
	next();
});
app.all('/', (req, res) => res.send("Welcome to Osiz Technologies"));
const search = require('./www/route.js');
app.use('/osiz', search);

app.use((req, res, next) => res.send({
	'RESPONSECODE': '2',
	'ERRCODE': '404',
	'MSG': 'Page not found'
}, 200));

/**
 * starting http server
 */
const portHttp = 3000;
const http = require('http').createServer(app);
const port = /* !bmgeneric.empty(process.env.PORT) ? process.env.PORT :  */portHttp;
http.listen(port, () => {
	console.info('http listening at port %d', port);
});