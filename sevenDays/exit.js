try{

	throw 'throw an err';
}catch(err){

	console.log(err);
	process.exit(1);
}

//process.stdout.write
//process.stderr.write
//process.stdin.read