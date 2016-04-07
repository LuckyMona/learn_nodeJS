var filterDir = require('./filterDir');


filterDir.filterDir(process.argv[2],process.argv[3],function(err,data){

	if(err)
	{
		console.log(err);
	}
	else
	{
		console.log(data);
	}
});





