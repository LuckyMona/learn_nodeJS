/*{
	_id:"unique_identifier1234",
	when:new TimeStamp(),
	what:"Good News Everyone!"
};*/

var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
	Server = require('mongodb').Server;


/*var mongodb = require('mongodb');
var b = new mongodb.Binary(binary_data);
var l = new mongodb.Long(number_string); */

var host = process.env['MONGO_NODE_DRIVER_HOST'] != null
	?process.env['MONGO_NODE_DRIVER_HOST']:'localhost';
var port = process.env['MONGO_NODE_DRIVER_PORT']!=null
	?process.env['MONGO_NODE_DRIVER_PORT']:Connection.DEFAULT_PORT;

var db = new Db("PhotoAlbums",
				New Server(host,port,
						   {auto_reconnect:true,
								poolSize:20}),
				{w:1});

