var http = require('http');
var url = require('url');

function start(route){

	function onRequest(request,response){

		var pathName = url.parse(request.url).pathname;

		response.writeHead(200,{'Content-Type':'text/plain'});
		response.write('Hello world!!');
		
		route(pathName);
		
		response.end();

	}

	http.createServer(onRequest).listen(8800);

	console.log('server start');
}

exports.start = start;
