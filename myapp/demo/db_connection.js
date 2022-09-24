var mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: "nodeuser",
	password: "TIC2601",
	database: "rabbit"
});

con.connect(function(err) {
	if (err) throw err;
	console.log("connected");
});


