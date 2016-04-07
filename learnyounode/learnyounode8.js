var http = require('http');
var bl = require('bl');

http.get(process.argv[2],function(response){


	//response.setEncoding('utf8');
	
	response.pipe(bl(function(err,data){
		
		if(err){ console.error }
		//var result = data.toString();
		console.log(data.length+'\n');
		console.log(data.toString());
	}));
});




