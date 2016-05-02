$(function(){
	var tmpl,
	tdata = {};
	console.log("home.js");
	var initPage = function(){
		$.get("/templates/home.html", function(d){
			tmpl = d;
		});
		$.getJSON("/albums.json",function(d){
			$.extend(tdata, d.data);
		});
		$(document).ajaxStop(function(){
			var renderedPage = Mustache.to_html(tmpl, tdata);
			$("body").html(renderedPage);
		});
	}();
	
});