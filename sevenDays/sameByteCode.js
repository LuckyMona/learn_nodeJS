function replace(pathName){

	var str = fs.readFileSync(pathName,'binary');
	str = str.replace('foo','bar');
	fs.writeFileSync(pathName, str, 'binary');
}