var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

function handle_incoming_request(req, res){
	var core_url = url.parse(req.url).pathname;
	if(core_url.substring(0,7) == "/pages/"){
		serve_page(core_url, res);
	}
}



function serve_page(path, res){
	console.log('path:'+path);
	var name = get_name(path);
	console.log('name:'+name);
	fs.exists('basic.html',function(exists){
		var ct = get_content_type('basic.html');		
		if(!exists){		
			res.writeHead(404, {'content-type':ct});
			res.end({
				error:"file_not_found",
				message:"file_not_found"
			});
			return;
		}
	});
	
	var rs = fs.createReadStream('basic.html');
	var contents = ""; 

	
	rs.on("error", function(e){
		res.end(JSON.stringify(e));
	});
	rs.on('readable',function(){
		
		var str;
		var d = rs.read();
		if(d){
			if(typeof d == "string"){
				str = d;
			} else if ( typeof d == "object" && d instanceof Buffer) {
				str = d.toString('utf8');
			}
			if(str){
				
				if(!contents){
					contents = str;
				} else {
					contents += str;
				}
			}
		}
		
	
	});
	rs.on('end',function(){
		
		contents = contents.replace('{{PAGE_NAME}}', name);
		console.log('contents:'+contents);
		res.writeHead(200, {"Content-Type":"text/html"});
		res.end(contents);
	})
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
function get_name(path){
	var name = path.split('/')[2];
	console.log('path2:'+path);
	return name;
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);