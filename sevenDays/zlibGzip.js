var zlib = require('zlib');
var http = require('http');

http.createServer(function(request,response){

	var data = '';
	for(var i=0;i<1024;i++)
	{
		data += '.';
	}

	if((request.headers['accept-encoding']||'').indexOf('zlib') != -1)
	{
		zlib.gzip(data,function(err,data){

			response.writeHead(200,{
				'Content-Type':'text/plain',
				'Content-Encoding':'gzip'
			});

			response.end(data);
		});
		
	}
	else{
		response.writeHead(200,{
			'Content-Type':'text/plain'
		});
		response.end(data);
	}
}).listen(8888);