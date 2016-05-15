var express = require('express');
var app = express();

app.configure(function(){
	app.use(express.bodyParser())
});
app.configure('dev',function(){
	app.use(express.logger('dev'));
});

app.configure('production','staging',function(){
	app.use(express.logger());
});