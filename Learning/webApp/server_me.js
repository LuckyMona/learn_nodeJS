var http  = require('http');

function handle_incoming_req(req, res){
	req.parsed_url = url.parse(req.url, true);
	var core_url = req.parsed_url.pathname;

	if(core_url.substr(0,7) == "/pages/"){
		serve_page(req, res);
	} else if (core_url.substring(0,11) == "/templates/"){
		serve_static_file("templates/" + core_url.substring(11), res);
	} else if (core_url.substring(0,9) == '/contents/'){
		serve_static_file("contents/"+ core_url.substring(9), res);
	} else if ( core_url == "/albums.json") {
		handle_list_albums(req, res);
	} else if ( core_url.substring(0, 7) == "/albums") {
		handle_get_album (req, res)
	} else {
		send_failure (res, 404, invalid_resourse());
	}
}

var s = http.createServer(handle_incoming_req);
s.listen(8080);

function serve_page(req, res){
	var core_url = req.parsed_url.pathname;
	var page = core_url.substring(7);
	if(page != 'home'){
		send_failure(res, 404, invalid_resourse());
		return;
	}
	fs.readFile('basic.html', function(err, contents){
		if(err){
			send_failure(res, 500, err);
			return;
		}
		contents = contents.toString('utf8');
		contents = contents.replace('{{PAGE_NAME}}',page);
		res.writeHead(200, {"Content-Type":"text/html"});
		res.end(contents);
	});
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