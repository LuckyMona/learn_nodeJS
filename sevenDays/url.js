var url = require('url');
var querystring = require('querystring');

var urlStr = 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash';

console.log(url.parse(urlStr));
console.log(url.parse(urlStr,true).query);

var urlObj = {
protocol: 'http:',
slashes: true,
auth: 'user:pass',
host: 'host.com:8080',
port: '8080',
hostname: 'host.com',
hash: '#hash',
search: '?query=string',
query: 'query=string',
pathname: '/p/a/t/h',
path: '/p/a/t/h?query=string',
href: 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash'

}

console.log(url.format(urlObj));
console.log(url.resolve('http://www.baidu.com/aaa/bbb','../ccc'));

console.log('=============querystring===========');
var queryObj = querystring.parse('foo=bar&baz=qux&baz=quux&corge');
console.log(queryObj);
console.log(querystring.stringify(queryObj));