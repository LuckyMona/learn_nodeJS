var express = require("express");
//var connect = require('connect');
var app = express();

//app.use(connect.compress());
app.use(express.compress());


app.listen(8080);