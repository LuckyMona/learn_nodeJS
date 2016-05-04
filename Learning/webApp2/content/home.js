$(function(){
	var tData = {};
	var tmpl = "";
	var initPage = function(){
		$.get('/templates/home.html', function(d){
			tmpl = d;
		});
		console.log('get');
		$.getJSON("/albums.json", function(d){
			console.log('getJSON');
			console.log('d'+d.albums);
			$.extend(tData, d.albums);

		});
		console.log('get2');
		$(document).ajaxStop(function(){
			var renderedPage = Mustache.to_html(tmpl, tData);
			$('body').html(renderedPage);
		});
	}();
	
});