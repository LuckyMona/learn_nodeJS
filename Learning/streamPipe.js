var fs = require('fs');


function server_static_file(file, res){
	var rs = fs.createReadStream(file);

	rs.on('error',function(e){
		console.log("oh no! Error!!"+JSON.stringify(e));
		res.end("");
	});

	var ct = 'text/plain';
	res.writeHead(200, {"Content-Type":ct});
	rs.pipe(res);
}