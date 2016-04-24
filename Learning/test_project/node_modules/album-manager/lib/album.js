var path = require('path');
var fs = require('fs');

function Album(album_path){
	this.name = path.basename(album_path);
	this.path = album_path;
}
Album.prototype.name = null;
Album.prototype.path = null;
Album.prototype._photos = null;

Album.prototype.photos = function(callback){
	if(this._photos != null)
	{
		callback(null, this._photos);
		return;
	}

	var self = this;
	fs.readdir(
		self.path,
		function(err, files){
		if(err){
			if(err.code =="ENOENT"){
				callback(no_such_album());
			} else {
				callback({
					error:"file_error",
					message:"JSON.stringify(err)"
				});
			}
			return;
		}

		var only_files = [];
		(function iterator(i){
			if(i==files.length)
			{
				self._photos = only_files;
				callback(null,self._photos);
				return;
			}
			fs.stat(self.path+"/"+files[i], function(err, stats){

				if(err){
					callback( {error:'file_error',message:JSON.stringify(err)} );
					return;
				}
				if(stats.isFile())
				{
					only_files.push(files[i]);
				}
				iterator(i+1);
			});
		})(0);
	});
}

exports.create_album = function(path){
	return new Album(path);
}

function no_such_album(){

	return { error:"no_such_album", message:"The specified album does not exist" };
}