var express = require('express');
var app = express();

app.use(express.logger('dev'))
	.use(express.responseTime())
	.use(function(req, res){
		res.end("hello world\n");
	})
	.listen(8080);
