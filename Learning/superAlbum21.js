var fs = require('fs');
var http = require('http');

function handle_req(req,res){
	console.log('incoming request:'+req.url + req.method);
	var url = req.url;
	if(url =='/album.json')
	{
		getAlbumsListHandle(req,res);
		
	} else if(url.substr(0,6) == '/album' && url.substr(url.length-5) == '.json'){
		getAlbumHandle(req, res);
	}
	else
	{
		sendError(res,makeErr(400,'bad request'));
	}
};
function sendError(res,err){
	res.writeHead(err.code, {'Content-Type':'application/json'});
	res.end(JSON.stringify(err));
}
function sendSuccess(res, data){
	res.writeHead(200,{'Content-Type':'application/json'});
	res.end(JSON.stringify(data));
}
function getAlbumsListHandle(req,res){
	getAlbumsList(function(err,albums){
		if(err)
		{
			sendError(res, err);
			
			return;
		}
		sendSuccess(res, {album:albums});
	});

}
function getAlbumHandle(req, res){
	var albumName = req.url.substr(6,req.url.length-11);;
	getAlbum(albumName,function(err,album){
		if(err){
			sendError(res,err);
			return;
		}
		sendSuccess(res, {album:album});
	});
}
function getAlbumsList(callback){
	fs.readdir('album',function(err,files){
		
		if(err)
		{	
			console.log('readdir /album err');
			callback(makeErr(err.code,'server read file error'));
			return;
		}

		var onlyDirs = [];
		(function iterator(i){
			
			fs.stat('album/'+files[i],function(err,stats){

				if( i==files.length)
				{
					var obj = {name:onlyDirs};
					callback(null,obj);
					return;
				}
				if(err)
				{
					callback(makeErr(err.code, 'fs stat error'));
					return;
				}
				else if(stats.isDirectory())
				{
					var obj = {'name':files[i]};
					onlyDirs.push(obj);
				}
				iterator(i+1);
			});
			
		})(0);

	})
}

function getAlbum( albumName, callback){
	var path = 'album/'+albumName;
	fs.readdir(path, function(err,albums){

		if(err)
		{
			callback(makeErr(err.code, 'fs readdir error'));
			return;
		}

		var len = albums.length;
		var albumsList = [];
		for(var i=0; i<len; i++)
		{
			var obj = {
				'name':albums[i],
				'desc':albums[i]
			};
			albumsList.push(obj);
		}
		callback(null,albumsList);
	});

}

function makeErr(code,msg){
	var e = new Error();
	e.msg = msg;
	e.code = code;
	return e;
};

var s = http.createServer(handle_req);
s.listen(8080);