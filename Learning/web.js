var http = require('http');
function process_request(req,res){

	var body = 'Thanks for calling!\n';
	var content_length = body.length;

	res.writeHead(200,{
		'Content-Type':'text/plain',
		'Content-Length':'content_length'
	});

	res.end(body);
}

var s = http.createServer(process_request);
s.listen(8080);