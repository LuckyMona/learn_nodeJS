var express = require("express");
var app = express();

app.use(express.logger('dev'))
	.use(express.bodyParser)
	.use(function(req, res){
		if(!req.files || !req.files.album_cover){
			res.end("Did you send a file?");
		} else {
			console.log(req.files);
			res.end(
				"You have asked to set the album cover for"
				+ req.body.albumid
				+ "to '" + req.files.album_cover.name + "'\n"
				);
		}
	})
	.listen(8080);