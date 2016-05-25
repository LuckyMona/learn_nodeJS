var express = require('express');
var app = express();

app.use(express.basicAuth(auth_user));
app.get('/',function(req, res){
	res.send('secret message that only auth\'d users can see \n');
});

app.use(function(err, req, res, next){
	res.status(500);
	res.end(JSON.stringify(err)+"\n");
});

app.listen(8080);

process.on('UncaughtException',function(err){
	console.log('Caught exception:'+err);
	process.exit(-1);
})
function auth_user(user, pass){
	if(user == 'hi'
		&& pass == 'me'){
		return true;
	} 
	return false;
}