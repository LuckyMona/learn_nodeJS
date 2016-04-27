var fs  = require('fs');

function handle_request(req, res){
	if(req.url.method.toLowerCase() == 'get' && req.url.substring(0,9) == '/content/'){
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
	rs.on('readable',function(){
		var d = rs.read();
		if(d){
			if(typeof d =="")
		}
	});
}