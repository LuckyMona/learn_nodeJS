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
	load_album_list(function(err,albums){
		if(err)
		{
			send_failure(res,500,err);
			return;
		}
		send_success(res,{album:albums});
	});

}

function handle_get_album(req,res){
	var album_name = req.url.substr(7,req.url.length-12);
	loadAlbum(album_name,function(err,album){
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

function load_album_list(callback){
	fs.readdir('album',function(err,data){
		if(err)
		{
			callback(make_error('file_error',JSON.stringify(err)));
			return;
		}
		var only_dirs = [];
		(function iterator(i){

			if(i = data.length)
			{
				callback(null,only_dirs);
				return;
			}
			fs.stat('album/'+ data[i],function(err,stats){
				if(err){
					callback(make_error('file_error',JSON.stringify(err)));
					return;
				}
				if(stats.isDirectory()){
					var obj = {name:data[i]};
					only_dirs.push(obj);
				}
				iterator(i+1);
			});
		})(0);

	});

}

function load_album(album_name,callback){
	fs.readdir('album/'+album_name,function(err,files){
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
		var path = 'album/'+album_name+'/';
		(function iterator(i){
			if(i == files.length)
			{
				var obj = { short_name:album_name, photos:only_files };
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
						var obj = { filename:fils[i], desc:files[i] };
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

function send_success(){

}

function send_failure(){

}

function invalid_resource(){

}
function no_such_album(){

}