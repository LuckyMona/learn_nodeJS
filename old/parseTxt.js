var Parser = require('./parser');
var fs = require('fs');
fs.readFile('log.txt',function(err,logData){

	if(err) throw err;

	var myParser = new Parser();
	var txt = logData.toString();
	var result = myParser.parse(txt);
	console.log(result);

});