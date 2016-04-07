var fs = require('fs');
var rs = fs.createReadStream('copySrc.txt');
var ws = fs.createWriteStream('copyDst.txt');
rs.on('data',function(chunk){
	ws.write(chunk);
});

rs.on('end',function(){

	ws.end();
});