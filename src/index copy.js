//====LIST DEPENDENCIES===//

const express = require('express');
const PouchDB = require('pouchdb');

const app = express();

const parseurl = require('parseurl');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');

//====ROOT DIRECTORY===//

app.get('/', function(req, res) {
  res.json('you did it');
});

//==========================//
