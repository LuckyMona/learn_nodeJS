var iconv = require('iconv-lite');
var fs = require('fs');

function readGBKText(pathName){

	var bin = fs.readFileSync(pathName);
	return iconv.decode(bin,'gbk');
}