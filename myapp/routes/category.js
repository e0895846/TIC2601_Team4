var express = require('express');
var router = express.Router();
var db = require('../sql.js')

var queryAsync = require('../mysql.js')

router.get('/:category', async (req, res) => {
    let category = req.params.category;
    let header = req.body.header;
    let content = req.body.content;

    let posts = {};
    let countPosts = {};
    
    try{
        categoryInfo = await queryAsync('SELECT * FROM category c WHERE c.category = ?' ,[category]);
        posts = await queryAsync('SELECT * FROM post p INNER JOIN data d ON p.post_id = d.post_id WHERE d.category = ?', [category]);
        categories = await queryAsync(db.getAllCategory);
        
        res.render('category', {
            req:req,
            title: category,
            categories: categories,
            categoryInfo: categoryInfo[0],
            posts:posts
        });
    }catch(error){
        console.log('SQL error', error);
        res.status(500).send('Something went wrong');
    }
});

module.exports = router;