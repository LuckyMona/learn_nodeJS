var fs = require('fs');
var http = require('http');
var url = require('url');

function handle_request(req,res){

	console.log("INCOMING_REQUSET:"+req.method+req.url);
	req.parsed_url = url.parse(req.url,true);
	core_url = req.parsed_url.pathname;
	if(core_url == '/album.json')
	{

		getAlbumsListHandle(req,res);

	}else if(core_url.substr(0,6) == '/album' && core_url.substr(core_url.length-5) =='.json'){

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
	
	var query =  req.parsed_url.query;
	var page = query.page ? query.page:0;
	var size = query.size ? query.size : 1000;
	if(isNaN(page)) page = 0;
	if(isNaN(size)) size = 1000;
	console.log('page:'+page+',size:'+size);

	var albumName = core_url.substr(6,core_url.length-11);
	console.log('albumName:'+albumName);
	getAlbum(albumName, page, size, function(err,album){
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
			if(i == data.length)
			{
				callback(null,{'album':only_dirs});
				console.log('i=length only_dirs='+only_dirs);
				return;
			}
			
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

function getAlbum(albumName, page, size, callback){
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

		var only_files = [];
		var path = 'album/'+albumName+'/';
		(function iterator(i){
			if(i == files.length)
			{
				var ps = only_files.splice(page*size,size);
				var obj = { short_name:albumName, photos:ps };
				callback(null, obj);
				return;
			}
			fs.stat(path+files[i],
				function(err,stats){
					if(err)
					{
						callback(make_error("file_error", JSON.stringify(err)));
						return;
					}
					if(stats.isFile())
					{
						var obj = { filename:files[i], desc:files[i] };
						only_files.push(obj);
					}
					iterator(i+1);
				});

		})(0);
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