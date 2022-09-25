var express = require('express');
var router = express.Router();
var db = require('../sql.js')
var bodyParser = require('body-parser')

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var queryAsync = db.queryAsync
var postSQL = db.postSQL
var coutPostSQL = db.coutPostSQL

router.get('/login', (req, res) =>{
    //res.render('login', {title: "Login Page"});
    res.end("Login Success")
});

router.post('/login', (req, res) =>{
    res.end("Login Success")
    //res.render('login', {title: "Login Page"});
});


// router.post('/login', async (req, res) =>{
//     let username = req.body.username;
//     let password = req.body.password;
        
//     let userInfo = {};
//     let posts = {};
//     let countPosts = {};

//       if(username && password){       
//        try{
//             userInfo = await queryAsync(userinfowPassSQL,[username,password]);
//             posts = await queryAsync(postSQL, [username]);
//             countPosts = await queryAsync(coutPostSQL, [username]);

//             if(userInfo.length > 0){
//                 res.render('index',{
//                     countPosts : countPosts,
//                     posts : posts,
//                     userInfo : userInfo
//                  });
//             }else{
//                 res.send('Incoreect username or password');
//             }
            
//        }catch(error){
//             console.log('SQL error', error);
//             res.status(500).send('Something went wrong');        
//        }
       
//     }else{
//         res.send('Please enter username and password');
//     }    
// });


module.exports = router;