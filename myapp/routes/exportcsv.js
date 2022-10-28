var express = require('express');
var router = express.Router();

//const bcrypt = require("bcrypt");
var queryAsync = require('../mysql.js');
var data_exporter = require('json2csv').Parser;


router.get('/', function(request, response, next){

    queryAsync('SELECT * FROM user', function(error, data){
        
        //convert data to JSON format
        var mysql_data = JSON.parse(JSON.stringify(data));

        //convert JSON to CSV data
        //define column header
        var file_header = ['Username', 'Join Date', 'E-mail', 'Admin', 'Reputation'];
        //convert it to CSV format
        var jason_data = new data_exporter({file_header});

        //convert other JSON data to CSV format
        var csv_data = jason_data.parse(mysql_data);

        response.setHeader("Content-Type", "text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=user_list.csv");
        response.status(200).end(csv_data);

    })
});

module.exports = router;