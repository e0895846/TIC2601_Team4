var express = require('express');
var router = express.Router();
var db = require('../sql.js');
var data_exporter = require('json2csv').Parser;
var queryAsync = require('../mysql.js')

const bcrypt = require("bcrypt");

router.get('/', async (req, res) => {    
    if(req.session.isLogin && req.session.isAdmin){      
        try{
            noOfUser = await queryAsync('SELECT COUNT(*) as count FROM user WHERE is_admin != 1');
            noOfPost = await queryAsync('SELECT COUNT(*) as count FROM post');
            let data = [noOfUser[0], noOfPost[0]];
            res.render('adminStatistic', {
                req:req,
                title:"Statistic",
                data:data
            });
        }catch(error){
            console.log('SQL error', error);
            res.status(500).send('Something went wrong');
        }          
    }else{  
        res.status(403).send('Forbidden, admin right required!');
    }
});


router.get('/usermgt', async (req, res) =>{    
    if(req.session.isLogin && req.session.isAdmin){           
        var query = `SELECT * FROM user ORDER BY username DESC`; //fetch data from mysql table
        try {
            data = await queryAsync(query);
            res.render('adminUsermgt', {
                title:'User List', 
                sampleData: data, 
                req:req});                
        } catch (error) {
            console.log('SQL error', error);
            res.status(500).send('Something went wrong');
        }        
    }else{
        res.status(403).send('Forbidden, admin right required!');
    }
});

router.post('/add_user_data', async(req, res) =>{
    if(req.session.isLogin && req.session.isAdmin){  
        //store form data in the local variable
        var username = req.body.username;
        var email = req.body.email;
        var admin = req.body.admin;
        var password = req.body.password;
        if(username && password){
            let result = await queryAsync('SELECT username FROM user WHERE username = ?', [username]);
            let salt, hashPassword;
            if(result.length > 0){
                res.status(412).send('This username has been used');
            }else{                
                salt = await bcrypt.genSalt(10);
                hashPassword = await bcrypt.hash(password, salt);                
            }

            try {
                await queryAsync('INSERT INTO user (username, email, password) VALUES (?, ?, ?)', [username, email, hashPassword]);
                res.redirect('/admin/usermgt');
            } catch (error) {
                console.log('SQL error', error);
                res.status(500).send('Something went wrong');
            }
        }else{
            res.status(412).send('Please enter username, password and email');
        }
        
    }else{
        res.status(403).send('Forbidden, admin right required!');
    }   
});

router.get('/adduser', async(req, res) =>{
    if(req.session.isLogin && req.session.isAdmin){  
        var title = 'New User Creation Form';   
        res.render('adminAddUser', {
            title: title,
            req:req
        });

    }else{
        res.status(403).send('Forbidden, admin right required!');
    }    
});

router.get('/exportcsv',  async (req, res) =>{ 
    if(req.session.isLogin && req.session.isAdmin){  
       //convert data to JSON format
       var mysql_data = JSON.parse(JSON.stringify(data));

       //convert JSON to CSV data
       //define column header
       var file_header = ['Username', 'Join Date', 'E-mail', 'Admin', 'Reputation'];
       //convert it to CSV format
       var jason_data = new data_exporter({file_header});

       //convert other JSON data to CSV format
       var csv_data = jason_data.parse(mysql_data);

       res.setHeader("Content-Type", "text/csv");
       res.setHeader("Content-Disposition", "attachment; filename=user_list.csv");
       res.status(200).end(csv_data);

    }else{
        res.status(403).send('Forbidden, admin right required!');
    }    
});

router.get('/edit/:username', async(req, res) =>{
    if(req.session.isLogin && req.session.isAdmin){  
        //store parameter value in the local variable
        var username = req.params.username;
        var title = 'Edit User Info';        
        
        try {
            data = await queryAsync('SELECT * FROM user WHERE username = ?',[username]);
            res.render('adminEditUser', {
                title : title,
                sampleData: data[0],
                req:req
            });
        } catch (error) {
            console.log('SQL error', error);
            res.status(500).send('Something went wrong');
        }
    }else{
        res.status(403).send('Forbidden, admin right required!');
    }  
});

router.post('/edit/:username', async(req, res) =>{
    //store data in local variable
    var username = req.params.username;
    var email = req.body.email;
    var reputation = req.body.reputation;
    var admin = req.body.admin;
    if(req.session.isLogin && req.session.isAdmin){        
        await queryAsync('UPDATE user SET email = ?, reputation = ?, is_admin = ? WHERE username = ?',[email, reputation, admin, username]);
        res.redirect('/admin/usermgt');
    }else{
        res.status(403).send('Forbidden, admin right required!');
    } 
});


router.get('/delete/:username', async(req, res) =>{
    if(req.session.isLogin && req.session.isAdmin){  
        var username = req.params.username;
        var query = `DELETE FROM user WHERE username="${username}";`
        try {
            await queryAsync(query);
            res.redirect('/admin/usermgt');
        } catch (error) {
            console.log('SQL error', error);
            res.status(500).send('Something went wrong');
        }
    }else{
        res.status(403).send('Forbidden, admin right required!');
    }
});

module.exports = router;