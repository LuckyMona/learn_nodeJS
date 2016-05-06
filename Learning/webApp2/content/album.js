$(function(){
	var tData = {};
	var tmpl = "";
	var initPage = (function(){

		var splits = window.location.href.split('/');
		
		var name = splits[5];
		
		$.get('/albums/'+name+'.json', function(d){
			$.extend(tData, d.data);
		});
		$.getJSON('/templates/album.html',function(d){
			tmpl = d;
		});
		$(document).ajaxStop(function(){
			var renderedPage = Mustache.to_html(tmpl, tData);
			$('body').html(renderedPage);
		});
	})();

});
