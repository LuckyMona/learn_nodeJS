var events = require('events');

function Downloader(){
}

Downloader.prototype = new events.EventEmitter();
Downloader.prototype._proto_ = events.EventEmitter.prototype;
Downloader.prototype.url = null;
Downloader.prototype.download_url = function (path){
	var self = this;
	self.url = path;
	self.emit('start', path);
	setTimeout(function(){
		self.emit('end', path);
	}, 1000);
}

var d = new Downloader();
d.on('start',function(path){
	console.log("download start");
});
d.on('end',function(path){
	console.log('download end');
});
d.download_url('www.baidu.com');
