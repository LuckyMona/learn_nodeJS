var fs = require('fs');
var http = require('http');


function loadAlbum(callback){
	fs.readdir('album',function(err,data){

		if(err)
		{
			callback(err);
			return;
		}
		callback(null,data);
	});

}

function handle_request(req,res){

	console.log("INCOMING_REQUEST:"+ req.method + req.url);
	loadAlbum(function(err,data){

		if(err)
		{
			res.writeHead(503,{'Content-Type':'Application/json'});
			res.end(JSON.stringify(err)+'\n');
			return;
		}

		res.writeHead(200,{'Content-Type':'application\json'});
		res.end(JSON.stringify(data)+'\n');
	});
}

var s = http.createServer(handle_request);
s.listen(8888);