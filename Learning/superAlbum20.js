var fs = require('fs');
var http = require('http');

function handle_req(req,res){
	console.log('incoming request:'+req.url + req.method);
	var url = req.url;
	if(url =='/album.json')
	{
		getAlbumsList(res,function(err, albums){
			if(err)
			{
				res.writeHead(err.code, {'Content-Type':'application/json'});
				res.end(JSON.stringify(err));
				return;
			}
			res.writeHead(200,{'Content-Type':'application/json'});
			res.end(JSON.stringify(albums));
		});
	} else if(url.substr(0,6) == '/album' && url.substr(url.length-5) == '.json'){
		var albumName = url.substr(6,url.length-11);
		getAlbum(res, albumName, function(err,album){
			if(err)
			{
				res.writeHead(err.code, {'Content-Type':'application/json'});
				res.end(JSON.stringify(err));
				return;
			}
			res.writeHead(200,{'Content-Type':'application/json'});
			res.end(JSON.stringify(album));
		});
	}
	else
	{
		res.writeHead(404, {'Content-Type':'application/json'});
		res.end('resource not found');
	}
};

function getAlbumsList(res,callback){
	fs.readdir('album',function(err,files){
		console.log('readdir /album');
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

function getAlbum(res, albumName, callback){
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