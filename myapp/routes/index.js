var express = require('express');
var router = express.Router();
var db = require('../sql.js')
var bodyParser = require('body-parser')

var urlencodedParser = bodyParser.urlencoded({ extended: false })



module.exports = router;