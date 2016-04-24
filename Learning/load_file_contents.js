var fs = require('fs');
function load_file_contents(path, callback){
	fs.open(path, 'r', function(err,f){
		if(err){
			callback(err);
			return;
		} else if (!f){
			callback({
				error:"invalid_file",
				message:"bad file handle from fs.open"
			});
			return;
		}
		fs.stat(f, function(err, stats){
			if(err){
				callback(err);
				return;

			}
			if(stats.isFile()){
				var b = new Buffer(10000);
				fs.read(f, b, 0, 10000, null, function(err, br, buf){
					if(err){
						callback(err);
						return;
					}
					fs.close(f, function(err){
						if(err){
							callback(err);
							return;
						}
						callback(null, b.toString('utf8', 0, br));
					})
				});
			} else {
				callback({
					error:"not_file",
					message:"Can't load directory"
				});
				return;
			}
		})

	});
}