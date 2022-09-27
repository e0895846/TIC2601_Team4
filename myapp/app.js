const path = require('path');

const {
    promisify,
} = require('util');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

app.set('views', path.join(__dirname, 'views/pages/'));
app.set('view engine', 'ejs');


var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var signupRouter = require('./routes/signup');
var editPostRouter = require('./routes/editPost');
var userRouter = require('./routes/user');

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/editPost', editPostRouter);
app.use('/user', userRouter);


app.use('/public', express.static(__dirname + "/public"))
app.use('/partial', express.static(__dirname + "/views/partial"))


var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});