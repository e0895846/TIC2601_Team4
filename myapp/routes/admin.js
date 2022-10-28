var express = require('express');
var router = express.Router();
var db = require('../sql.js')

var queryAsync = require('../mysql.js')

router.get('/', async (req, res) => {
    
    try{
        noOfUser = await queryAsync('SELECT COUNT(*) as count FROM user WHERE is_admin != 1');
        noOfPost = await queryAsync('SELECT COUNT(*) as count FROM post');
        let data = [noOfUser[0], noOfPost[0]];
        console.log(data);
        res.render('admin', {
            req:req,
            title:"Rabbit",
            data:data
        });
    }catch(error){
        console.log('SQL error', error);
        res.status(500).send('Something went wrong');
    }
});

module.exports = router;