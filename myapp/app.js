const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser')
const session = require('express-session')

const {
    promisify,
} = require('util');

const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))

app.set('views', path.join(__dirname, 'views/pages/'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'tic2601',
    resave: false,
    saveUninitialized: true
    
}));

app.use('/public', express.static(__dirname + "/public"))
app.use('/partial', express.static(__dirname + "/views/partial"))

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

    console.log("Example app listening at http://localhost:8080");
});

console.log("Recommended display resolution: 1920x1080");