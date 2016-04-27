var b = new Buffer(10000);
var str = '我叫王二狗';
b.write(str);
console.log('b is:'+b.toString('utf8'));
console.log(b.length);
console.log(str.length);
console.log(Buffer.byteLength(str));
var b1 = new Buffer('My name is ');
var b2 = new Buffer('Mary');
var b3 = Buffer.concat([b1,b2]);
console.log(b3.toString('utf8'));

b.fill("\0");
console.log('b is:'+b.toString('utf8'));
