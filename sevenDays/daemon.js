var child_process = require('child_process');

console.log('daemon');
function daemon(module)
{
	var worker = child_process.spawn('node',[module]);

	worker.on('exit',function(code){

		if(code != 0)
		{
			daemon(module);
		}
	});
}

daemon('exit.js');