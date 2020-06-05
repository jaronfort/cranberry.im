const functions = require('firebase-functions');
//const express = require('express');
//const engines = require('consolidate');

//const app = express();
//app.engine('hbs', engines.handlebars);
//app.set('views', './views');
//app.set('view engine', 'hbs');

exports.connect = functions.https.onRequest((request, response) => {
    response.send('connecting...');
});
