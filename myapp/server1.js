const path = require('path');

const {
    promisify,
} = require('util');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, 'views/pages/'));
app.set('view engine', 'ejs');

const mysql = require('mysql');
const con = mysql.createConnection({
  host: 'localhost',
  user: 'nodeuser',
  password: 'TIC2601',
  database: 'myapp'
});

con.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});

app.get('/', (req, res) =>{
    res.render('login');
});

app.get('/goto_signup', (req, res) =>{
    res.render('signup');
});

app.get('/signout', (req, res) => {
    res.clearCookie('nToken');
    return res.redirect('/');
});


const queryAsync = promisify(con.query).bind(con);
const insPostSQL = `INSERT INTO posts (username, header, contents) VALUES (?, ?, ?)`;
const userinfowPassSQL = 'SELECT * FROM users WHERE username = ? AND password = ?';
const userinfonoPassSQL = 'SELECT * FROM users WHERE username = ?';
const postSQL = 'SELECT * FROM posts WHERE username = ?';
const coutPostSQL = 'SELECT COUNT(*) as count FROM posts WHERE username = ?';
const insUserSQL = 'INSERT INTO users (username, password) VALUES (?, ?)';
const deletepostSQL = 'DELETE FROM posts WHERE postid = ?';
const getpostbyIdSQL = 'SELECT * FROM posts WHERE postid = ?';
const updatepostSQL = 'UPDATE posts SET header = ?, contents = ? WHERE postId = ?';

app.post('/login', async (req, res) =>{
    let username = req.body.username;
    let password = req.body.password;
        
    let userInfo = {};
    let posts = {};
    let countPosts = {};

      if(username && password){       
       try{
            userInfo = await queryAsync(userinfowPassSQL,[username,password]);
            posts = await queryAsync(postSQL, [username]);
            countPosts = await queryAsync(coutPostSQL, [username]);

            if(userInfo.length > 0){
                res.render('index',{
                    countPosts : countPosts,
                    posts : posts,
                    userInfo : userInfo
                 });
            }else{
                res.send('Incoreect username or password');
            }
            
       }catch(error){
            console.log('SQL error', error);
            res.status(500).send('Something went wrong');        
       }
       
    }else{
        res.send('Please enter username and password');
    }    
});

app.post('/signup', async function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    if(username && password){                  
        try{
            await queryAsync(insUserSQL,[username, password]);
            res.render('login');
        }catch(error){
            console.log('SQL error', error);
            res.status(500).send('Something went wrong');
        } 
    }else{
        res.send('Please enter username and password');
    }  
     
});

app.post('/postPage/:username', async (req, res) =>{
    let username = req.params.username.substring(1);
    let header = req.body.header;
    let content = req.body.content;

    let userInfo = {};
    let posts = {};
    let countPosts = {};
    
    try{
        await queryAsync(insPostSQL,[username, header, content]);
        userInfo = await queryAsync(userinfonoPassSQL,[username]);
        posts = await queryAsync(postSQL, [username]);
        countPosts = await queryAsync(coutPostSQL, [username]);
        
        res.render('index',{
            countPosts : countPosts,
            userInfo:userInfo,
            posts:posts
        });
    }catch(error){
        console.log('SQL error', error);
        res.status(500).send('Something went wrong');
    }
       
});

app.post('/delete_post/:id/:username', async (req, res) =>{    
    let postId = parseInt(req.params.id.substring(1));
    let username = req.params.username.substring(1);
    let userInfo = {};
    let posts = {};
    let countPosts = {};  
    
    try {
        await queryAsync(deletepostSQL, [postId]);
        userInfo = await queryAsync(userinfonoPassSQL,[username]);
        posts = await queryAsync(postSQL, [username]);
        countPosts = await queryAsync(coutPostSQL, [username]);
        
        res.render('index',{
            countPosts : countPosts,
            userInfo:userInfo,
            posts:posts
        });
    } catch (error) {
        console.log('SQL error', error);
        res.status(500).send('Something went wrong');
    }
});

app.post('/edit_post/:id/:username', async (req, res) =>{
    
    let postId = parseInt(req.params.id.substring(1));     
    
    let posts = {};

    try {        
        posts = await queryAsync(getpostbyIdSQL, [postId]);
        res.render('editPost',{
            posts : posts,            
        });
    } catch (error) {
        console.log('SQL error', error);
        res.status(500).send('Something went wrong');
    }
});

app.post('/updatePost/:id/:username', async (req, res) =>{
        
    let postId = parseInt(req.params.id.substring(1)); 
    let username = req.params.username.substring(1);
    let header = req.body.header;
    let content = req.body.content;

    let userInfo = {};
    let posts = {};
    let countPosts = {};  

    try {
        await queryAsync(updatepostSQL,[header, content, postId]);
        userInfo = await queryAsync(userinfonoPassSQL,[username]);
        posts = await queryAsync(postSQL, [username]);
        countPosts = await queryAsync(coutPostSQL, [username]);
        
        res.render('index',{
            countPosts : countPosts,
            userInfo:userInfo,
            posts:posts
        });
    } catch (error) {
        console.log('SQL error', error);
        res.status(500).send('Something went wrong');
    }
    
});

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});