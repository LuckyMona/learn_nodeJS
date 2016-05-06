var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var async = require('async');

function handle_incoming_request(req, res){
	var core_url = url.parse(req.url).pathname;
	if(core_url.substring(0,7) == "/pages/"){
		serve_page(core_url, res);
	} else if ( core_url == "/albums.json"){
		handle_album_list(req,res);
	} else if ( core_url.substring(0,7) == "/albums" 
		&& core_url.substring(core_url.length - 5) == '.json'){
		handle_album(core_url,res);
	} else if ( core_url.substring(0,9) == "/content/") {
		serve_static_page( core_url.substring(1), res);
	} else if ( core_url.substring(0, 11) =="/templates/") {
		serve_static_page( core_url.substring(1), res);
	}	
}
function handle_album (url, res){
	
	get_album(url.substring(1), function(err, files){
		if(err){
			send_failure(res, err);
			return;
		}
		send_success(res, { albums: files });
	} );
}
function get_album(path, callback){
	var p = path.substring(0,path.substring(path.length-5));
	var album_name = get_name(p);
	fs.readdir(p, function(err,files){
		if(err){
			send_failure(err);
			return;
		}
		var only_files = [];
		async.forEach(
			files,
			function(elem, callback){
				fs.stats(elem, function(err, stats){
					if(err){
						callback(err);
						return;
					}
					if(stats.isFile()){
						only_files.push({name:elem});
					}

				});
			},
			function(err){
				callback(err, err?null:{album_name:only_files});
			}
		);
	});
}
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

function handle_album_list(req, res){
	load_album_list('albums',function(err, files){
		if(err){
			send_failure(res, err);
			return;
		}
		
		send_success(res, {albums:files});
	});

}
function load_album_list(path, callback){
	fs.readdir(path, function(err,files){
		
		var only_dirs = [];
		async.forEach(
			files,
			function(elem, callback){
				fs.stat('albums/'+ elem, function(err, stats){
					if(err){
						callback(err);
						return;
					}
					if(stats.isDirectory()){
						only_dirs.push({name:elem});
					}
					callback(null);
				})
			},
			function(err){
				callback(err, err?null:only_dirs);
			}
		);
		
	});
}
function send_failure(res, err){
	res.writeHead(404, {"Content-Type":"application/json"});
	res.end(JSON.stringify(err));
}

function send_success(res, files){
	res.writeHead(200, {"Content-Type":"application/json"});
	var out = { 
		error:null,
		data:files
	};

	res.end(JSON.stringify(out));
}

function serve_page(path, res){

	var name = get_name(path);
	fs.exists('basic.html',function(exists){
				
		if(!exists){		
			res.writeHead(404, {'content-type':"text/html"});
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
	return name;
}

var s = http.createServer(handle_incoming_request);
s.listen(8080);