var fs = require('fs');
var path = require('path');

function filterDir(originPath,extName,callback){

	fs.readdir(originPath,function(err,list){

		if(err)
		{
			return callback(err);
		}
		else
		{
			var arr = [];
			for(var i=0; i<list.length; i++)
			{
				if(path.extname(list[i]).substring(1) == extName)
				{
					arr.push(list[i]);
				}
			}
			callback(null,arr.join('\n'));
		}
	});

}

exports.filterDir = filterDir;





