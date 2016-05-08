var express = require('express');
var app = express();
var fs = require('fs');
var url = require('url');
var path = require('path');
var async = require('async');

var album_hdlr = require('./handlers/album.js');
var page_hdlr = require('./handlers/page.js');
var helpers = require('./handlers/helpers.js');

app.get('/albums.json', album_hdlr.list_all);
app.get('/albums/:album_name.json',album_hdlr.album_by_name);
app.get('/content/:filename', function(req, res){
	serve_static_page('content/'+ req.params.filename, res);
});
app.get('templates/:template_name', function(req, res){
	serve_static_page('templates/'+req.params.template_name, res);
});
app.get('/pages/:page_name', page_hdlr.generate);
app.get('/pages/:page_name/:sub_page', page_hdlr.generate);
app.get(*, four_oh_four);

function four_oh_four(req, res){
	send_failure(res, { error:'error', message:"invalid_resource"});
};


function serve_static_page(path, res){
	
	var ct = get_content_type(path.split('/')[2]);
	fs.exists(path, function(exists){
		
		if(!exists){
			
			res.writeHead(404, {"Content-Type":ct});
			var out = {
				error:"file '"+path+"' not found",
				message:"file '"+path+"' not found"
			};
			res.end(JSON.stringify(out));
			return; 
		}
	});
	var rs = fs.createReadStream(path);
	
	rs.on('error', function(e){
		res.end();
	});
	
	res.writeHead(200, {"Content-Type":ct});
	rs.pipe(res);
}




function get_content_type(file_path){
	var ext = path.extname(file_path);
	switch(ext){
		case '.html':
			return "text/html";
			break;
		case ".js":
			return "text/js";
		case ".css":
			return "text/css";
		case ".json":
			return "application/json";
	}
}


//var s = http.createServer(handle_incoming_request);
app.listen(8080);