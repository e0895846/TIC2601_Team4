const mysql = require("mysql")

const coon = mysql.createConnection({
    host: "localhost",
    user: "nodeuser",
    password: "TIC2601",
    database: "rabbit"
})

coon.connect();

coon.query('select * from users', (err,results,fields)=>{
    if (err) throw err;
    console.log(results);
});

coon.end();