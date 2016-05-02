var fs = require('fs');

function serve_static_file(file, res){

	fs.exists(file, function(exists){
		if(!exists){
			res.writeHead(404,{'Content-Type':"application/json"});
			res.end(JSON.stringify(
				{
					error:'file not found',
					message:"'"+file+"' not found"
				}));
			return;
		}
		var rs = fs.createReadStream(file);
		rs.on('error',function(err){
			res.end();
		});
		var ct = "application/json";
		rs.writeHead(200, {"Content-Type":ct});
		rs.pipe(res);
	});
	
}