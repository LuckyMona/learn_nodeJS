var fs = require('fs');
var path = require('path');

function travel(dir,callback){

	fs.readdirSync(dir).forEach(function(file){

		var pathName = path.join(dir,file);

		if(fs.statSync(pathName).isDirectory())
		{
			travel(pathName,callback);
		}
		else
		{
			callback(pathName);
		}

	});
};
