var str = 'Hello World';
var bin = new Buffer(str,'utf-8');
console.log(bin);
console.log(bin.length);
console.log(bin[2]);
console.log(bin.toString());

var bin2 = new Buffer([0x68, 0x65, 0x6c, 0x6c, 0x6f]);
console.log('bin2:'+bin2[0]);


var bin3 = new Buffer([0x68, 0x65, 0x6c, 0x6c, 0x6f]);
var bin32 = new Buffer(bin3.length);

bin3.copy(bin32);

bin32[0] = 0x78;
console.log(bin3[0]);
console.log(bin32[0]);

