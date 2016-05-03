$(function(){
	var tData = {};
	var tmpl = "";
	var initPage = function(){
		$.get('/templates/home.html', function(d){
			tmpl = d;
		});
		$.getJSON("albums.json", function(d){
			$.extend(tData, d.data);
		});
		$(document).ajaxStop(function(){
			var renderedPage = Mustache.to_html(tmpl, tData);
			$('body').html(renderedPage);
		});
	}();
	
});