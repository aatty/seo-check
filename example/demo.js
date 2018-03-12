const Parse = require('../src/parse.js');

try{
  /**
	* You can optonal set the customized rules as needed.
	*/
	Parse.tag('h2').setRule({'more-than': 2});

	/** 
	* You can optonal enable which html tag will be check as needed 
	* if you don't want to defect all html tags.
	*/
	Parse.setEnable(['h1', 'h2', 'img']);

	/**
	 * Set input type is necessary. The input can be file(with input file path) or stream.
	 */
	Parse.input('file','./example.html');
	//or you can output stream Parse.input('stream');

	/**
	* Set output type . The default output is console.
	*/
	Parse.output('console');
	Parse.run();

}catch(err){
  console.log(err);
}
