var fs = require('fs');
var rs = fs.createReadStream('copySrc.txt');
var ws = fs.createWriteStream('copyDst.txt');
rs.on('data',function(chunk){
	if(ws.write(chunk) ===false ){
		rs.pause();
	}
});

rs.on('end',function(){

	ws.end();
});

ws.on('drain',function(){
	rs.resume();
});