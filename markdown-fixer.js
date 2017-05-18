const fs = require('fs');
const path = require('path');

const rootDir = process.argv[2] || __dirname; //Take the 'directory path' given in command line argument. Otherwise take the 'current directory'

//List of Regular Expressions need to apply
const changeRules = [{
	//Header Elements fixers
	'find': /^(#+)([^ #].+)$/,
	'replaceWith': "$1 $2"
}, {
	//URL Link elements fixers
	'find': /(\[.+\])\s+(\(.*\))/,
	'replaceWith': "$1$2"
}];

const fixItRalph = (dir) => {
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		file = path.join(dir, file);
		const stat = fs.statSync(file);

		if (stat && stat.isDirectory()) //recursively search in sub-directories
			fixItRalph(file);
		else if (stat && path.extname(file) === '.md') {
			fs.readFile(file, 'utf8', (err, data) => {
				if (err) console.log(err);

				let result = data;
				changeRules.forEach(elem => {
					result = result.replace(new RegExp(elem.find, "g"), elem.replaceWith);
				})

				fs.writeFile(file, result, 'utf8', err => {
					if (err) console.log(err);
				});
			});
		}
	});
}

fixItRalph(rootDir);
