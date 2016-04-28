var fs = require('fs');

function serve_static_file(file, res){
	fs.exists(file,function(exists){
		if(!exists)
		{
			res.writeHead(404, {"Content-Type":'application/json'});
			res.end({
				error:"file_not_fount",
				message:"'"+file+"' not found"
			});
			return;
		}
		var rs = fs.createReadStream(file);
		rs.on('error',function(e){
			res.end(JSON.stringify(e));
		});
		res.writeHead(200, { "Content-Type":'text/plain' });
		rs.pipe(res);
	})
}