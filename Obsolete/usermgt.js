var express = require('express');
var router = express.Router();

//const bcrypt = require("bcrypt");
var queryAsync = require('../mysql.js');


//create a new route with address /sample_data
router.get('/', function(request, response, next){

    var query = `SELECT * FROM user ORDER BY username DESC`; //fetch data from mysql table
    queryAsync(query, function(error, data) { //1st para is the sql query, 2nd para call back function
        if(error) {
            throw error;
        }
        else{
            response.render('usermgt', {title:'User List', 
                action: 'list', sampleData: data});
            //if no error, render a view and sends the rendered HTML string to the client
            //1st para is the views file name in the views folder that the result is to be rendered
            //2nd para is to define data in JSON string format to be sent to views file.
            //data under sampleData will be fetched from mysql table
        }
    });


});

//create a new route with address /sample_data/add
router.get('/add', function(request, response, next){

    //load add form in the browser

    response.render("usermgt", {title:'New User Creation Form',
                                    action:'add'});
    //1st para is the views file name
    //2nd para we need to define in JSON format which data we want to send to template file
});

//create route to handle data post request
router.post("/add_user_data", function(request, response, next){

    //store form data in the local variable
    var username = request.body.username;
    var email = request.body.email;
    var admin = request.body.admin;
    var password = request.body.password;

    //insert data query. Define variable in query under node js
    var query = `
    INSERT INTO user
    (username, email, is_admin, password)
    VALUES("${username}", "${email}","${admin}","${password}")
    `;

    //execute above insert query
    //first para is the mysql insert query which we have stored under variable 'query' above
    queryAsync(query, function(error, data){
        if(error){
            throw error;
        }
        else{
            //after insert the form data into mysql, redirect page to display all sample data
            //this function will redirect url to another page
            response.redirect("/usermgt");
        }

    });

});

//load form with data in order to edit
router.get('/edit/:username', function(request, response, next){
    //store parameter value in the local variable
    var username = request.params.username;

    //fetch single row of data
    var query = `SELECT * FROM user WHERE username = "${username}"`;
    
    //execute the above query
    queryAsync(query, function(error, data){

        response.render('usermgt', {title: 'Edit User Info', action:'edit', sampleData: data[0]});
        //1st para is the views file name
        //2nd para define data which we want to send to views file

    });

});

//submit edit form data
    
router.post('/edit/:username', function(request, response, next){
    //store data in local variable
    var username = request.params.username;

    var email = request.body.email;
    var reputation = request.body.reputation;
    var admin = request.body.admin;

    //let salt = bcrypt.genSalt(10);
    //let hashPassword =bcrypt.hash(password, salt);
    //update form data into mysql database

    var query = `
    UPDATE user
    SET
    email = "${email}",

    reputation = "${reputation}",
    is_admin = "${admin}"
    WHERE username = "${username}"
    `;

    //execute query
    queryAsync(query, function(error, data){
        if(error){
            throw error;
        }
        else{
            response.redirect('/usermgt');
        }
    });

});

router.get('/delete/:username', function(request, response, next){
    //get id value from url
    var username = request.params.username;

    // delete query on database
    var query = `
    DELETE FROM user WHERE username="${username}";
    `

    //execute query
    queryAsync(query, function(error, data){
        if(error){
            throw error;
        }
        else{
            response.redirect('/usermgt');
        }
    });
});




module.exports = router;