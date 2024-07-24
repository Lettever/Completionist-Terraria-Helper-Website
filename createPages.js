const fs = require('fs');
const YAML = require('js-yaml');

// Read YAML data from a file
const readYAMLFromFile = (filePath) => {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return fileContents;
  } catch (err) {
    console.error('Error reading the file:', err);
    return null;
  }
};

// YAML to JSON conversion function
const yamlToJson = (yamlStr) => {
  // Convert YAML to JSON
  return YAML.load(yamlStr);
};

// JSON to HTML conversion function
const jsonToHtml = (obj) => {
	let result = '';
	const h1_template = '<h1>${id}:</h1>'
	const div_template = '<div id="${id}">';
	const input_template = '${index} <input type="checkbox" id="${id}">';
	const span_template = '<span><a href="${wiki_link}" target="_blank">${name}</a></span><br>';
	const helper = (obj2, ident) => {
		if (Array.isArray(obj2)) {
			const space = '\t'.repeat(ident + 1);
			const index_length = obj2.length.toString().length;
			//console.log(obj2.length)
			//console.log(index_length);
			obj2.forEach((x, i) => result +=
				space + input_template.replace('${id}', x).replace('${index}', ('00' + (i % 40 + 1)).slice(-index_length)) +
				span_template.replace('${wiki_link}', getLinkToWiki(x)).replace('${name}', x) + '\n'
			);
		} else if(isDict(obj2)) {
			for (const key in obj2) {
				const space = '\t'.repeat(ident);
				result += space + h1_template.replace('${id}', key) + '\n';
				result += space + div_template.replace('${id}', key) + '\n';
				helper(obj2[key], ident + 1);
				result += space + '</div>\n';
			}
		} else {
			console.log('something is wrong');
		}
		return result;
	};
	return helper(obj, 1);
};

function isDict(obj) {
	return typeof obj === 'object'
}
function getLinkToWiki(itemName) {
	return 'https://terraria.wiki.gg/wiki/' + itemName.replace(' ', '_')
}
function createHtmlFile(html) {
	let result = ''
	result += '<!DOCTYPE html>\n';
	result += '<head>\n';
	result += '	<style>\n';
	result += '	div {\n';
	result += '		border-left-style: solid;\n';
	result += '		padding-left: 20px;\n';
	result += '	}\n';
	result += '	a:link, a:visited {\n';
	result += '		color: blue;\n';
	result += '		text-decoration: none;\n';
	result += '	}\n';
	result += '	</style>\n';
	result += '	<script src="checkbox.js"></script>\n';
	result += '</head>\n';
	result += '<body>\n';
	result += '	<button onclick="saveToFile()">Save to File</button>\n';
	result += '	<button onclick="loadFile()">Load from File</button>\n';
	result += html;
	result += '</body>';
	//console.log(result);
	return result;
}
function main() {
	const stuff = [
		'accessories',
		'ammo',
		'armors',
		'cages',
		'mounts',
		'pets',
		'tools',
		'vanity',
		'weapons',
	];
	//createHtmlFile('hello\n');
	const input_template = './Items/${file}.yaml';
	const output_template = './Html/${file}.html';
	stuff.forEach((x) => {
		const input_file = input_template.replace('${file}', x);
		const output_file = output_template.replace('${file}', x);
		console.log(input_file, output_file);
		
		const yamlData = readYAMLFromFile(input_file);
		if (!yamlData) {
			return;
		};
		
		const jsonData = yamlToJson(yamlData);
		const htmlOutput = jsonToHtml(jsonData);
		//console.log(htmlOutput);
		fs.writeFile(output_file, createHtmlFile(htmlOutput), function(err) { if(err) console.error(err); });
		console.log('Done');
		console.log();
	});
	
	
}
main()