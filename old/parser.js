function Parser(){};
Parser.prototype.parse = function(txt){

	var result = {};
	var lines = txt.split('\n');

	lines.forEach(function(line){

		var parts = line.split(' ');
		var letter = parts[1];
		var num = parseInt(parts[2]);

		if(!result[letter])
		{
			result[letter] = 0;
		}
		result[letter] += num;
	});

	return result;
}

module.exports = Parser;