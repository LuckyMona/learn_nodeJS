var fs = require('fs');
//console.log(process.argv);
fs.readFile(process.argv[2],'utf8',function(err,data){
	if(err){
		console.log(err);
	}
	else
	{
		console.log( data.split('\n').length-1);
	}

});


