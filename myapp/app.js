const path = require('path');

const {
    promisify,
} = require('util');

const express = require('express');
const app = express();

var cookieParser = require('cookie-parser')
app.use(cookieParser())

const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

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


app.use('/public', express.static(__dirname + "/public"))
app.use('/partial', express.static(__dirname + "/views/partial"))


var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});