var path = require('path');
var cache = {};
function store(key,value){
	cache[path.normalize(key).replace(/\\/g,'/')] = value;
}

store('foo/bar',1);
store('foo/aaa/bbb/../bar',2);
store('foo/aaa/../bar',3);
console.log(cache);

console.log(path.join('foo/aaa/bbb/ccc','../bar','../../bar0'));

console.log(path.extname('foo/bar/bar.js'));