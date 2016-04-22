var fs = require('fs');
var album = require('./album');

exports.version = "1.0.0";
exports.albums = function(root,callback){
	fs.readdir(
		root+'/album',
		function(err, albums){
			if(err){
				callback({
					error:'file_error',
					message:JSON.stringify(err)
				});
				return;
			}

			var albums_list = [];
			(function iterator(i){
				if(i == albums.length ){
					callback(null, albums_list);
					return;
				}
				fs.stat(
					root + 'album/' + albums[i],
					function(err, stats){
						if(err){
							callback({
								error:"stats_err",
								message:JSON.stringify(err)
							});
							return;
						}

						if(stats.isDirectory()){
							var p = root + 'album/' + albums[i];
							albums_list.push(album.create_album(p));
						}

						//albums_list.push(albums[i]);
						//iterator(i+1);
					}
				);
			})(0);

		}
	);
}