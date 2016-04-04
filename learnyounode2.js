//console.log(process.argv);

var count = process.argv.slice(2);
//console.log(count);
function sumTotal(arr)
{
	var len = arr.length,
	i = 0,
	total = 0;


	for(i; i<len; i++)
	{
		total += Number(arr[i]);
	}

	console.log(total);
}

sumTotal(count);
