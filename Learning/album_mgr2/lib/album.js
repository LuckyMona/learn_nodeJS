var fs = require('fs');
var path = require('path');

function Album(path_name)
{
	this.name = path.basename(path_name);
	this.path = path_name;
}
Album.prototype.name = null;
Album.prototype.path = null;
Album.prototype._photos = null;

Album.prototype.photos = function(callback){

	var path = this.path;
	var self = this;
	fs.readdir(
		path,
		function(err,files){
			if(err)
			{
				callback({
					error:"file_error",
					message:JSON.stringify(err)
				});
				return;
			}
			var album_photos = [];
			(function iterator(i){
				if(i == files.length)
				{
					self._photos = album_photos;
					callback(null,self._photos);
					return;
				}
				fs.stats(
					path+files[i],
					function(err,stats){
						if(err){
							callback({
								error:"stats_error",
								message:JSON.stringify(err)
							});
							return;
						}
						if(stats.isFile()){
							album_list.push(files[i]);
						}
					}
					iterator(i+1);
				);
			})(0);
		}
	);
}

exports.create_album = function(path){
	return new Album(path);
}