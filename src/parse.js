const cheerio = require('cheerio');
const fs = require('fs');

const ruleCollection = {
  "h1": {
		"method": "more-than",
		"value": 1,
	},
	"strong": {
		"method": "more-than",
		"value": 15,
	},
	"a": {
		"method": "withoutAttr",
		"value": [
			"rel",
		],
	},
	"img": {
		"method": "withoutAttr",
		"value": [
      "alt",
		],
	},
	"head": {
		"child": {
			"title": {
				"method": "less-than",
				"value": 1,
			},
			"meta": {
				"method": "hasAttr",
				"value": [
					"name=description",
					"name=keywords",
				]
			}
		}
	}
};

const Parse = {
	inputType: null,
	inputFile: null,
	outputType: null,
	destination: null,
	outputCollection: [],
	input: function(){
    const [inputType, inputFile] = [...arguments];
    if(inputType != 'file' && inputType != 'stream') throw 'The input type is not defined.';
    
		this.inputType = inputType;
		if(inputType == 'file'){
      if(inputFile == null) throw 'file path is necessary when use file input.';
			this.inputFile = inputFile;
		}
	},
	output: function(){
		const [outputType, destination] = [...arguments];

    if(outputType != 'stream' && outputType != 'file' && outputType != 'console')
      throw 'The output tpye you send is not defined.';
		if(outputType == 'file'){
			this.outputType = 'file';
			this.destination = destination;
		}else if(outputType == 'stream'){
      this.outputType = 'stream';
		}else{
			this.outputType = 'console';
		}
	},
	run: function() {
		
		if(this.inputType == 'file'){
      if (!fs.existsSync(this.inputFile)) {
        throw 'File Path not exists.';
      }
      fs.readFile(this.inputFile, (err, content) => {
				const $ = cheerio.load(content);
				this.$ = $;
				this.excute(err, ruleCollection);

	      if(this.outputType == null || this.outputType == 'console'){
          this.outputConsole(this.outputCollection);
			  }else if(this.outputType == 'file'){
          this.outputFile(this.outputCollection);
				}else{
          this.outputStream(this.outputCollection);
				}
			});
		}else if(this.inputType == 'stream'){
			const stream = (process.argv.length > 2)
								? fs.createReadStream(process.argv[2])
								: process.stdin;
			
			stream.setEncoding('UTF8');
			let content = '';
			stream.on("data", (chunk) => {
				content = content + chunk;
			});
			
			stream.on("end", () => {
				const $ = cheerio.load(content);
				this.$ = $;
				this.excute(null, ruleCollection);
				if(this.outputType == null || this.outputType == 'console'){
					this.outputConsole(this.outputCollection);
				}else if(this.outputType == 'file'){
					this.outputFile(this.outputCollection);
				}else{
					this.outputStream(this.outputCollection);
				}
			});
		}
	},
	outputStream: function(output){
		const outputStream = process.stdout;
		outputStream.setEncoding('UTF8');
		output.forEach((msg) => {
      outputStream.write(msg);
		}); 
	},
	outputFile: function(output){
		let content = ''; 
		output.forEach((msg) => {
      content = content+msg+'\n';
		});
    fs.writeFile(this.destination, content, function(err) {
			if(err) {
					return console.log(err);
			}
			console.log("The file was saved!");
	  }); 
	},
	outputConsole: function(output){
		output.forEach((msg) => {
      console.log(msg);
		}); 
	},
	tag: function(tag){
    if(typeof tag != 'string') throw 'Tag format is illegal, it must be astring';
		ruleCollection.tag = {};
		this.tmp = tag;
	  return this;
	},
	setRule: function(rules){
		const rulesArr = Object.entries(rules);
		rulesArr.forEach((rule) => {
      ruleCollection[this.tmp] = {
				"method": rule[0],
				"value": rule[1],
			};
		});
		return this;
	},
	setEnable: function(enable) {
		const tags = Object.keys(ruleCollection);
		let removeProperties = [];
		tags.forEach((tag) => {
			let flag = false;
			enable.forEach((value) => {
        if(value == tag){
          flag = true;
				}
			});

			if(flag == false){
				removeProperties.push(tag);
			}
		});

		removeProperties.forEach((value) => {
      delete ruleCollection[value];
		});
	},
	setDisable: function(disable) {
    disable.forEach((value) => {
			delete ruleCollection[value];
		});
	},
	hasAttr: function(tag, rule, rootTag) {
		const rootString = (rootTag != null ) ? `In <${rootTag}> Tag. ` : ``;
		rule.value.forEach((value) => {
			let exist = false;
			let content = false;
			const [attrName, attrValue] = value.split('=', 2);

      this.$(tag).each((i, elem) => {
				let value = this.$(elem).attr(attrName);
				if(value == undefined){
					return true;
				}
				if(attrValue != null){
					content = true;
					if(attrValue == value){
						exist = true;
						return true;
					}
					return true;
				}else{
					exist = true;
					return true;
				}
			});
	
			if(!content){
				if(exist){
					this.outputCollection.push(`${rootString}A ${tag} tag with ${attrName} attribute exist.`);
				}else{
					this.outputCollection.push(`${rootString}A ${tag} tag with ${attrName} attribute not exist.`);
				}
			}else{
				if(exist){
					this.outputCollection.push(`${rootString}A ${tag} tag with '${attrName}=${attrValue}' attribute exist`);
				}else{
					this.outputCollection.push(`${rootString}A ${tag} tag with '${attrName}=${attrValue}' attribute not exist. `);
				}
			}
		
		});

	},
	moreThan: function(tag, rule, rootTag) {
		let amount = this.$(tag).length;
		if(amount > rule.value){
			this.outputCollection.push(`The HTML has more than ${rule.value} <${tag}> tag`);
		}
	},
	withoutAttr: function(tag, rule, rootTag) {
		rule.value.forEach((value) => {
			let countAttr = 0;
			let countValue = 0;
			const [attrName, attrValue] = value.split('=', 2);

			this.$(tag).each((i, elem) => {
				let value = this.$(elem).attr(attrName);
				if(typeof value == "undefined" && attrValue == null){
				  countAttr = countAttr + 1;
				}
				if(attrValue != null && (value != attrValue) ){
				  countValue = countValue + 1;
				}
			});

			const rootString = (rootTag != null ) ? `In <${rootTag}> Tag. ` : ``;
			if(countAttr > 0){
			  this.outputCollection.push(`${rootString}There are ${countAttr} <${tag}> tag without '${attrName}' attribute.`);
			}
			if(countValue > 0 ){
				this.outputCollection.push(`${rootString}There are ${countValue} <${tag}> tag without '${attrName}=${attrValue}' .`);	
			}

		});
	},
	lessThan: function(tag, rule, rootTag) {
	  const rootString = (rootTag != null ) ? `In <${rootTag}> Tag. ` : ``;
		let amount = this.$(tag).length;
	
		if(amount < rule.value){
			this.outputCollection.push(`${rootString}The HTML has less than '${rule.value}' <${tag}> tag.`);
		}
	},
	excute: function(err, ruleCollection, rootTag=null) {
		const tags = Object.keys(ruleCollection);
		const outputCollection = [];
		tags.forEach((tag) => {
		  const child =  ruleCollection[tag].child;
		  if(typeof child != "undefined"){
			  this.excute(tag, ruleCollection[tag].child, tag);
			  return true;
		  }
	
			const method = ruleCollection[tag].method;
		  if(method == "more-than"){
			  this.moreThan(tag, ruleCollection[tag], rootTag);
		  }else if(method == "withoutAttr"){
			  this.withoutAttr(tag, ruleCollection[tag], rootTag);
		  }else if(method == "less-than"){
 	      this.lessThan(tag, ruleCollection[tag], rootTag);
		  }else if(method == "hasAttr"){
 		    this.hasAttr(tag, ruleCollection[tag], rootTag);
			}
		});
		
	},
}


module.exports = Parse;