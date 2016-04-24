var async = requrie('async');

async.parallel({
	string:function(callback){
		setTimeout(function(){
			callback(null,['a','b','c']);
		},1500);
	},
	number:function(callback){
		setTimeout(function(){
			callback(null, ['1','2','3']);
		},2000);
	}

},
function(err, results){
	console.log(results);
});
