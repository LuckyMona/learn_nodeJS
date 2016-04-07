
function route(handle,pathname){
	console.log("About to route a request for " + pathname);
	if(typeof handle[pathname] == 'function')
	{
		handle[pathname]();
	}

}

exports.route = route;