function factorial(num){
	if(num<2)
	{
		return 1;
	}
	else
	{
		return num*arguments.callee(num-1);
	}
}

console.log(factorial(4));