var fs = require('fs');
var http = require('http');
var url = require('url');

//url格式：http://localhost:8080/album/albumname/rename.json
function handle_request(req,res){

	console.log("INCOMING_REQUSET:"+req.method+req.url);
	req.parsed_url = url.parse(req.url);
	core_url = req.parsed_url.pathname;

	if(core_url == '/album.json')
	{

		getAlbumsListHandle(req,res);

	}else if( core_url.substr(core_url.length - 12) == '/rename.json'
			  && core_url.method.toLowerCase() == 'post'){
		renameAlbumHandle(req,res);

	}
	else if(core_url.substr(0,6) == '/album' && core_url.substr(core_url.length-5) =='.json'){

		getAlbumHandle(req,res);
	}
	else
	{
		send_failure(res,404,invalid_resource());
	}

}
function renameAlbumHandle(req,res){
	var album_name = core_url.split('/')[2];
	var json_body = '';
	 req.on(
	 		'readable', 
	 		function(){
	 			var d = req.read();
	 			if(d){
	 				if(typeof d == 'string')
	 				{
	 					json_body+=d;
	 				}else if (typeof d == 'object' && d instanceof Buffer){
	 					json_body += d.toString('utf8');
	 				}
	 			}
	 		});
	 req.on(
	 		'end',
	 		function(){
	 			if(json_body){
	 				try{
	 					var album_data = JSON.parse(json_body);
	 					if(!album_data.album_name)
	 					{
	 						send_failure(res, 403, missing_data('album_name'));
	 						return;
	 					}
	 				}catch(e){
	 					send_failure(res, 403, bad_json());
	 					return;
	 				}

	 				do_rename(
	 					album,
	 					album_data.album_name,
	 					function(err,results){
	 						if(err && err.code == 'ENOENT'){
	 							send_failure(res, 403, no_such_album());
	 							return;
	 						} else if (err) {
	 							send_failure(res,500,file_error(err));
	 							return;
	 						}
	 						send_success(res,null);
	 					}
	 				);

	 			} else {
	 				send_failure(res, 403, bad_json());
	 				res.end();
	 			}

	 		});
}
function do_rename(old_name, new_name, callback){
	fs.rename(
		'album/'+ old_name,
		'album/'+ new_name,
		callback);
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
	var albumName = core_url.substr(6,req.url.length-11);
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
			if(i == data.length)
			{
				callback(null,{data:only_dirs});
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

		var only_files = [];
		var path = 'album/'+albumName+'/';
		(function iterator(i){
			if(i == files.length)
			{
				var obj = { short_name:albumName, photos:only_files };
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
function bad_json() {
    return make_error("invalid_json",
                      "the provided data is not valid JSON");
}

function file_error(err) {
    var msg = "There was a file error on the server: " + err.message;
    return make_error("server_file_error", msg);
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

function missing_data (missing) {
    var msg = missing
        ? "Your request is missing: '" + missing + "'"
        : "Your request is missing some data.";
    return make_error("missing_data", msg);
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