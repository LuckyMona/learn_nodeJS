var fs = require('fs');
var path = require('path');

function filterDir(originPath,extName){

	fs.readdir(originPath,function(err,list){

		if(err)
		{
			console.log(err);
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
			console.log(arr.join('\n'));
		}
	});

}

filterDir(process.argv[2],process.argv[3]);





