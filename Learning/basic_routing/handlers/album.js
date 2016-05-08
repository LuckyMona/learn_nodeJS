var helpers = require(./helpers.js);
var fs = require('fs');
var async = require('async');

exports.version = "0.1.0";

exports.list_all = function(req, res){
	load_album_list(function(err, files){
		if(err){
			helpers.send_failure(res, 500, err);
			return;
		}
		
		helpers.send_success(res, {albums:files});
	});
}

exports.album_by_name = function(req, res){

	var getp = req.query;
	var page_num = getp.page ? getp.page : 0;
	var page_size = getp.page_size ? getp.page_size : 1000;
	if(isNaN(parseInt(page_num))) page_num = 0;
	if(isNaN(parseInt(page_size))) page_size = 0;

	var album_name = req.params.album_name;
	load_album(
		album_name,
		page_num,
		page_size,
		function(err, album_contents){
			if(err && err.error == "no_such_album"){
				helpers.send_failure(res, 404, err);
			} else if (err) {
				helpers.send_failure(res, 500, err);
			} else {
				helpers.send_success(res, { album_data:album_contents });
			}

		}
	);

};

function load_album(album_name, page, page_size, callback){

	fs.readdir(
		'albums/'+album_name, 
		function(err,files){
			if(err){
				if(err.code == "ENOENT"){
					callback(helpers.no_such_album());
				} else {
					callback(helpers.make_error('file_error',JSON.stringify(err)));
				}
				return;
			}
		
		
		var only_files = [];
		var path = 'albums/'+album_name +'/' ;

		async.forEach(
			files,
			function(elem, cb){
				fs.stat(path+elem, function(err, stats){
				
					if(err){
						cb(helpers.make_error('file_error', JSON.stringify(err)));
						return;
					}
					if(stats.isFile()){
						
						only_files.push({file_name:elem, desc:elem});
					}
					cb(null);
				});
			},
			function(err){
				
				if(err){
					callback(err);
				} else {
					var ps = page_size;
					var photos = only_files.splice(page*ps, ps);
					var obj = {
						short_name:album_name,
						photos:photos
					};
					 callback(null, obj);
				}
				//callback(err, err?null:{'album_name':only_files});
				//console.log('only_files:'+only_files);
			}
		);

	});
}

function load_album_list(callback){
	fs.readdir('albums', function(err,files){
		
		var only_dirs = [];
		async.forEach(
			files,
			function(elem, callback){
				fs.stat('albums/'+ elem, function(err, stats){
					if(err){
						callback(err);
						return;
					}
					if(stats.isDirectory()){
						only_dirs.push({name:elem});
					}
					callback(null);
				})
			},
			function(err){
				callback(err, err?null:only_dirs);
			}
		);
		
	});
}