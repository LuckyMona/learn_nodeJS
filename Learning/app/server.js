var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.end('Hello world');
});
app.get("/albums/:album_name/photos/:photo_name.json", function(req, res){
	res.end("requsted:"+ req.params.album_name+"/"+req.params.photo_name);
});
app.get("/users/:user_id.json", function(req, res, next){
	var user_id = parseInt(req.params.user_id);
	if(user_id<3)
	{

		next();
	} else {
		res.end("request user_id is:"+ user_id);
	}

});


app.listen(8080);