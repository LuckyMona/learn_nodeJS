var fs = require('fs');
function readTxt(pathName){

	var bin = fs.readFileSync(pathName);
	if(bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF)
	{
		bin = bin.slice(3);
	}

	return bin.toString('utf-8');
}