const functions = require('firebase-functions');
const app = require('./server/server');

exports.api = functions.https.onRequest(app);
