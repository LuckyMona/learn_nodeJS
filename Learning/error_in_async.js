try{
	setTimeout(function(){
		throw new Error('oh error!');
	},2000);
}catch(e){
	console.log('catch an error:'+ e.message);
}