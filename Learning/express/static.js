app.use(express.static("/secure/static_site_files"));
app.use(express.static(_dirname));
app.use(express.static(_dirname + "/../static"));

app.use(express.bodyParser());
app.use(express.cookieParser());


app.get('/',function(req, res){
	res.redirect("/pages/home");
	res.end()
});