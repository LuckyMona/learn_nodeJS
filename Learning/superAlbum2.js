var fs = require('fs');
var http = require('http');

function handle_request(req,res){

	console.log("INCOMING_REQUSET:"+req.method+req.url);

	if(req.url == '/album.json')
	{

		getAlbumsListHandle(req,res);

	} 
	else if(req.url.substr(0,6) == '/album' && req.url.substr(req.url.length-5) =='.json'){
		
		getAlbumHandle(req,res);
	}
	else
	{
		send_failure(res,404,invalid_resource());
	}

}

function getAlbumsListHandle(req,res){
	getAlbumsList(function(err,albums){		
		if(err)
		{
			send_failure(res,500,err);
			return;
		}
		console.log('albums:'+albums);
		send_success(res,{album:albums});
	});
}

function getAlbumHandle(req,res){
	var albumName = req.url.substr(6,req.url.length-11);
	getAlbum(albumName,function(err,album){
		if(err && err.error == 'no_such_album')
		{
			send_failure(res,404,err);
		}
		else if(err)
		{
			send_failure(res,500,err);
		}
		else
		{
			send_success(res,{album_data:album});
		}
	});
}
function getAlbumsList(callback){
	fs.readdir('album',function(err,data){
		
		if(err)
		{	
			callback(make_error('file_error',JSON.stringify(err)));
			return;
		}

		var onlyDirs = [];
		(function iterator(i){
			if(i = data.length)
			{
				callback(null,only_dirs);
				console.log('i=length only_dirs='+only_dirs);
				return;
			}
			/*fs.stat('album/italy',function(err,stats){
				console.log('italy');
			});*/
			fs.stat('album/'+data[i],function(err,stats){
				if(err)
				{
					callback(make_error('file_error',JSON.stringify(err)));
					return;
				}
				if(stats.isDirectory())
				{
					var obj = {'name':data[i]};
					onlyDirs.push(obj);
				}
				iterator(i+1);
			});
		})(0);

	});
}

function getAlbum(albumName,callback){
	fs.readdir('album/'+albumName, function(err,files){
		if(err)
		{
			if(err.code == 'ENOENT')
			{
				callback(no_such_album());
			}
			else{
				callback(make_error('file_error',JSON.stringify(err)));
			}
			return;
		}

		var len = files.length;
		var albumsList = [];
		for(var i=0; i<len; i++)
		{
			var obj = {
				'name':files[i],
				'desc':files[i]
			};
			albumsList.push(obj);
		}
		callback(null,albumsList);
	});

}















function make_error(err,msg){
	var e = new Error(msg);
	e.code = err;
	return e;
}

function send_success(res,data){
	res.writeHead(200,{'Content-Type':'application/json'});
	var output = {error:null,data:data};
	res.end(JSON.stringify(output) +'\n');

}

function send_failure(res,code,err){
	var code = err.code ? err.code:err.name;
	res.writeHead(code,{'Content-Type':'application/json'});
	res.end(JSON.stringify({error:code,message:err.message}) + '\n');
}

function invalid_resource(){
	return make_error('invalid_resource','ths requested resource does not exist.');
}
function no_such_album(){
	return make_error('no_such_album','the specified album does not exist');
}


var s = http.createServer(handle_request);
s.listen(8080);