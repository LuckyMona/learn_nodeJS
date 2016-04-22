var amgr = require('./album_mgr2');
amgr.albums('./',function(err,albums){
	if(err)
	{
		console.log('Unexpected Error:'+JSON.stringify(err));
		return;
	}


	(function iterator(i){
		if(i == albums.length )
		{
			console.log("Done");
			return;
		}
		albums[i].photos(function(err, photos){
			if(err){
				console.log("Err loading album:" + JSON.stringify(err));
				return;
			}

			console.log(albums[i].name);
			console.log(photos);
			console.log("");
			iterator(i+1);
		});
	})(0);

});