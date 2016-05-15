var express = require('express');
var app = express();
var MemStore = express.session.memoryStore;

app.use(express.logger('dev'))
	.use(express.cookieParser())
	.use(express.session({
		secret:'cat',
		cookie:{maxAge:18600000},
		store:MemStore
	}))
	.use(function(req, res){
		var x = req.session.last_access;
		req.session.last_access = new Date();
		res.end("last request:"+x);
	})
	.listen(8080);