var fs  = require('fs');
var http = require('http');
var path = require('path');
function handle_request(req, res){
	if(req.method.toLowerCase() == 'get' && req.url.substring(0,9) == '/content/'){
		serve_static_file(req.url.substring(9), res);
	} else {
		res.writeHead(404, { "Content-Type":"application/json"});
		var err = {
			error:"not_fount",
			message:"'"+req.url+"' not fount"
		};
		res.end(JSON.stringify(err) + "\n");
	}
}

function serve_static_file(path, res){
	var rs = fs.createReadStream(path);
	var ct = content_type_for_path(path);
	res.writeHead('200',ct);
	rs.on('readable',function(){
		var d = rs.read();
		if(d){
			
			if(typeof d =="string")
				res.write(d);
			else if (typeof d == 'object' && d instanceof Buffer)
				res.write(d.toString('utf8'));
		}
	});
	rs.on('end',function(){
		res.end();
	});
};
function content_type_for_path (path){
	var ext = path.extname(path);
	switch(ext.toLowerCase()){
		case '.html': return "text/html";
		case '.js' : return "text/javascript";
		case '.css': return "text/css";
		case '.jpg': case '.jpeg':return "image/jpeg";
		default: return 'text/plain';

	} 
}

var s = http.createServer(handle_request);
s.listen(8080);

