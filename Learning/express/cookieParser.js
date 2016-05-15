var express = require('express');
var app = express();

var MemStore = express.session.MemoryStore;
app.use(express.session({
	secret:"cat",
	cookie:{maxAge:1800000},
	store:new MemStore();

}))

app.use(express.cookieParser())
	.use(function(req, res){
		res.cookie("pet", "petName",
				{expires:new Date(Date.now() + 86400000)}
			);
		};
		//res.clearCookie('pet');
		res.end(JSON.stringify(req.query) + "\n");
	})
	.listen(8080);