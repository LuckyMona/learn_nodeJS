var fs = require('fs');
var rs = fs.createReadStream('copySrc.txt');
rs.on('data',function(chunk){
	rs.pause();
	print(chunk,function(){
		rs.resume();
	})

	function print(msg,callback){

		console.log(msg.toString('utf8'));
		callback();
	
	}
	
});

rs.on('end',function(){

	console.log('createReadStream end');
});