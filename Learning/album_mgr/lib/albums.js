var fs = require('fs');
var album = require('./album.js');

exports.version = '1.0.0';
exports.albums = function (root, callback){

	fs.readdir(root+"/album",function(err,files){
		if(err){
			callback(err);
			return;
		}
		var album_list = [];
		//console.log("files:"+files);
		(function iterator(i){
			if(i == files.length)
			{
				//console.log("album_list:"+album_list);
				callback(null,album_list);
				return;
			}
			fs.stat(
				root+"album/"+files[i],

				function(err,stats){
					if(err){
						callback({ error:"file_error",
								   message:JSON.stringify(err) });
						return;
					} 
					
					if (stats.isDirectory())
					{
						var p = root + "album/"+files[i];
						album_list.push(album.create_album(p));
					}

					iterator(i+1);
				}
			);
			
		})(0);

	})
}