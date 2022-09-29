const {
    promisify,
} = require('util');

const express = require('express');
const app = express();
app.use(express.json());

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

const path = require('path');
app.set('views', path.join(__dirname, 'views/pages/'));
app.set('view engine', 'ejs');


var fs = require('fs')
var routes = fs.readdirSync('./routes/')
var routeDict = {}
for (var file of routes){
	routeDict[file.substr(0, file.length-3)] = require('./routes/' + file)
}
for (var key in routeDict){
	var webpath = key == 'index' ? '/' : '/' + key;
	app.use(webpath, routeDict[key]);
}


var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});