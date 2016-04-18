var http = require('http');
var qs = require('querystring');

function handle_request(req, res){
	var json_body = "";
	req.on(
			'readable',
			function(){
				var d = req.read();
				if(d)
				{
					if(typeof d == "string"){
						json_body += d;
					} else if (typeof d == 'object' && d instanceof Buffer) {
						json_body += d.toString('utf8');
					}
				}
			});
	req.on(
			'end',
			function(){
				if( req.method.toLowerCase() == "post" )
				{	
					var post_data = qs.parse(json_body);
					console.log(post_data);
				}
				res.writeHead(200, { "Content-Type":"application/json"});
				res.end(JSON.stringify({'error':null, 'postData':json_body}));
			});
};
var s = http.createServer(handle_request);
s.listen(8080);