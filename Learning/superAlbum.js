var fs = require('fs');
var http = require('http');

function handle_request(req,res){

	console.log("INCOMING_REQUSET:"+req.method+req.url);
	if(req.url == '/album.json')
	{
		handle_list_albums(req,res);
	}
	else if(req.url.substr(0,5) == '/album' && req.url.substr(req.url.length-5) =='.json'){
		handle_get_album(req,res);
	}
	else
	{
		send_failure(res,404,invalid_resource());
	}

}

function handle_list_albums(req,res){
	
}