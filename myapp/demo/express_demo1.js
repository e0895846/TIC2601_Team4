const express = require("express");

const app = express();

app.listen(8081, ()=> {
    console.log("express server running at localhost:8081")
})