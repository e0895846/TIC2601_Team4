var express = require('express');
var router = express.Router();
var db = require('../sql.js')

var queryAsync = require('../mysql.js')
var insPostSQL = db.insPostSQL
var userinfonoPassSQL = db.userinfonoPassSQL
var postSQL = db.postSQL
var coutPostSQL = db.coutPostSQL
var deletepostSQL = db.deletepostSQL
var getpostbyIdSQL = db.getpostbyIdSQL

router.get('/signout', (req, res) => {
    //res.clearCookie('nToken');
    return res.redirect('/');
});

router.get('/:username', async (req, res) => {
    let username = req.params.username;
    let header = req.body.header;
    let content = req.body.content;

    let userInfo = {};
    let posts = {};
    let countPosts = {};
    
    try{
        userInfo = await queryAsync(userinfonoPassSQL,[username]);
        posts = await queryAsync(postSQL, [username]);
        countPosts = await queryAsync(coutPostSQL, [username]);
        
        res.render('user',{
            totalCount : countPosts[0].count || posts.length,
            userInfo:userInfo,
            posts:posts
        });
    }catch(error){
        console.log('SQL error', error);
        res.status(500).send('Something went wrong');
    }
});

// router.post('/postPage/:username', async (req, res) =>{
//     let username = req.params.username.substring(1);
//     let header = req.body.header;
//     let content = req.body.content;

//     let userInfo = {};
//     let posts = {};
//     let countPosts = {};
    
//     try{
//         await queryAsync(insPostSQL,[username, header, content]);
//         userInfo = await queryAsync(userinfonoPassSQL,[username]);
//         posts = await queryAsync(postSQL, [username]);
//         countPosts = await queryAsync(coutPostSQL, [username]);
        
//         res.render('user',{
//             countPosts : countPosts,
//             userInfo:userInfo,
//             posts:posts
//         });
//     }catch(error){
//         console.log('SQL error', error);
//         res.status(500).send('Something went wrong');
//     }
       
// });

router.post('/delete_post/:id', async (req, res) =>{    
    let postId = parseInt(req.params.id.substring(1));
    let username = await queryAsync('SELECT username FROM posts WHERE postid = ?', [postId]);
    if (req.session.isLogin && req.session.user.username == username[0].username) {

        let userInfo = {};
        let posts = {};
        let countPosts = {};  
        
        try {
            await queryAsync('DELETE FROM posts WHERE postid = ?', [postId, loginuser]);

            userInfo = await queryAsync(userinfonoPassSQL,[username]);
            posts = await queryAsync(postSQL, [username]);
            countPosts = await queryAsync(coutPostSQL, [username]);
            
            res.render('user',{
                totalCount : countPosts[0].count || posts.length,
                userInfo:userInfo,
                posts:posts
            });
            
        } catch (error) {
            console.log('SQL error', error);
            res.status(500).send('Something went wrong');
        }
    }
});

router.post('/edit_post/:id', async (req, res) =>{
    
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

module.exports = router;