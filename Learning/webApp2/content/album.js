$(function(){
	var tData = {};
	var tmpl = "";
	var initPage = (function(){
		console.log(window.href);
		var splits = window.href.split('/')[5];
		console.log(splits);
		var name = splits[5];
		$.get('/albums/'+name+'.json', function(d){
			$.extend(tData, d.data);
		});
		$.getJSON('/templates/album.html',function(d){
			tmpl = d;
		});
		$(document).ajaxStop(function(){
			var renderedPage = mustache.to_html(tmpl, tData);
			$('body').html(renderedPage);
		});
	})();

});
