var fs = require('fs');
var http = require('http');

function load_album_list(callback){

	fs.readdir('album',function(err,data){

		if(err)
		{
			callback(err);
			return;
		}
		callback(null,data);
	});
}

function handle_incoming_request(req,res){
	console.log('INCOMING_REQUEST:'+ req.method + req.url);
	load_album_list(function(err,data){

		if(err)
		{
			res.writeHead(503,{'Content-Type':'application/json'});
			res.end(JSON.stringify(err)+'\n');
			return;
		}
		res.writeHead(200,{'Content-Type':'application/json'});
		res.end(JSON.stringify(data) + "\n");
	});

}

var s = http.createServer(handle_incoming_request);
s.listen(8888);