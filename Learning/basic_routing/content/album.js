$(function(){
	var tData = {};
	var tmpl = "";
	var initPage = (function(){

		var splits = window.location.href.split('/');
		
		var name = splits[5];
		console.log('name:'+name);
		
		$.get('/templates/album.html',function(d){
			console.log('tmpl');
			tmpl = d;
		});
		$.getJSON('/albums/'+name+'.json', function(d){
			console.log('get');
			
			var photo_d = massage_album(d);
			$.extend(tData, photo_d);
		});
		$(document).ajaxStop(function(){
			var renderedPage = Mustache.to_html(tmpl, tData);
			$('body').html(renderedPage);
		});
	})();

});

function massage_album(d){
	if(d.error != null)
		return d;
	
	var af = d.data.album_data;
	
	return af;
}
