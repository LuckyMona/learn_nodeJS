 var fs = require('fs');
 var async = require('async');

 function load_file_contents(path, callback){
 	async.waterfall([
 		function(callback){
 			fs.open(path, 'r', callback);
 		}
 	]);
 }