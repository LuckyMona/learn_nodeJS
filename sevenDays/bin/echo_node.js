//var argv = require('argv');
//var process = require('express');
var echo = require('../lib/echo');

//console.log(argv);
//console.log(echo.echo(argv.join(' ')));
var arr = process.argv.slice(2);
console.log(echo(arr.join('/')));