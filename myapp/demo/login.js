const http = require("http");
const querystring = require("querystring");
const mysql = require("mysql");

const server = http.createServer((req, res)=>{
    let postValue = "";
    req.on("data", (chunk)=> {
        postValue += chunk;
    })
    req.on("end", ()=> {
        let obj = querystring.parse(postValue);
        let username = obj.username;
        let password = obj.password;
        console.log(username + " " + password);

        const coon = mysql.createConnection({
            host: "localhost",
            user: "nodeuser",
            password: "TIC2601",
            database: "rabbit",
            port: 3306
        })

        coon.connect();

        coon.query("SELECT * FROM users WHERE name=? AND password=?", 
            [username, password], (err, results, fields)=>{
                if (err) throw err;
                //console.log(results);
                if (results.length > 0) {
                    res.write("Login Successfully");
                    res.end();
                }
            })

        // coon.query("SELECT * FROM users", (err, results, fields)=>{
        //     if (err) throw err;
        //     console.log(results);
        //     })

        coon.end();
    })
})

server.listen(8081);