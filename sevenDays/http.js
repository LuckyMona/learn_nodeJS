var http = require('http');

http.createServer(function(request,response){

	console.log(request.method);
	console.log(request.headers);

	response.writeHead(200,{

		'Content-Type:text/plain'
	});
	request.on('data',function(chunk){
		response.write(chunk);
	});

	request.on('end',function(){
		response.end();
	});

}).listen(8888);