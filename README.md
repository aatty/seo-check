# seo-check

A simple npm package to check HTML SEO defect.

## Getting Started

### Installation

Using npm:

```
npm install cxtt/seo-check
```

### Basic usage
The following example show easy way to check html seo.
For example, create a test.js file:
```
const Parse = require('seo-check');  
try{
  Parse.input('file','./example.html');
  Parse.run();
}catch(err){ 
  console.log(err);
}

```
and run node test.js will show the output on console like this:
```
There are 1 <a> tag without 'rel' attribute.
There are 1 <img> tag without 'alt' attribute.
In <head> Tag. A meta tag with name=descriptions attribute exist
In <head> Tag. A meta tag with name=keywords attribute not exist.
```


## Input/Output
You can also set the input and output type.
The input can be:
1. file
2. stream

The output can be:
1. console (default)
2. file
3. writable stream
```
const Parse = require('seo-check');  
try{
  Parse.input('stream');
  Parse.output('file','your output file destination');
  // or Parse.output('stream');
  Parse.run();
}catch(err){ 
  console.log(err);
}
```

### Default Rules

1. Detect if any <img /> tag without alt attribute.
2. Detect if any <a /> tag without rel attribute.
3. Detect if there’re more than 15 \<strong> tag in HTML
4. Detect if a HTML have more than one \<H1> tag.
5. The <head> tag
   - Detect if header doesn’t have \<title> tag
   - Detect if header doesn’t have \<meta name=“description” ... /> tag
   - Detect if header doesn’t have \<meta name=“keywords” ... /> tag
   
## Set custom rules
You can also set custom rules or overwrite the default rule easily.
#### The package provide these mothod:
##### more-than
Detect if a HTML have more than two specify tag.
```
Parse.tag('h2').setRule({'more-than': 2});
// defect if html has more than 2 h2 tag
```
output:
```
The HTML has more than 2 <h2> tag
```
#### less-than
Detect if a HTML have more less two specify tag.
```
Parse.tag('img').setRule({'less-than': 3});
// defect if html has less than 3 <img> tag
``` 
output:
```
The HTML has less than '3' <img> tag.
```
#### withoutAttr
Detect if any specify tag without specify attribute.
```
Parse.tag('a').setRule({'withoutAttr': ['rel']});
//Detect if any <a /> tag without rel attribute
```
output:
```
There are 1 <a> tag without 'rel' attribute.
```
you can alse check multi attributes and values.
```
Parse.tag('meta').setRule({'withoutAttr': ["name=description","name=keywords"]});
```
output:
```
There are 1 <meta> tag without 'name=description' .
There are 2 <meta> tag without 'name=keywords' .
```



#### hasAttr
Detect if any specify tag has specify attribute.
```
Parse.tag('meta').setRule({'hasAttr': ["name","keywords"]});
```
output
```
A meta tag with name attribute exist.
A meta tag with keywords attribute not exist.
```
#### Overall
```
const Parse = require('seo-check');  
try{
  // set new rule to check if a HTML have more than two <H2> tag.
  Parse.tag('h2').setRule({'more-than': 2});
  
  // overwrite default rule to check if a HTML have more than three <H2> tag.
  Parse.tag('h1').setRule({'more-han': 3});
  Parse.input('file','./example.html');
  Parse.input('file','./output.txt');
  
  // excute
  Parse.run();
}catch(err){ 
  console.log(err);
}
```

## Select which Tag would be check
Maybe you don't want to check all of the rules? Tell you a good news.
Now you can decide which tag will be checked by the following set.

```
try{
  Parse.tag('h2').setRule({'more-han': 2});
  Parse.tag('h1').setRule({'more-han': 3});
  Parse.input('file','./example.html');
  Parse.setEnable(['h1', 'img']); // That will only check h1, omg tags.
  Parse.setDisable(['a', 'head']) // That will exclude these two tags
  Parse.run();
}catch(err){ 
  console.log(err);
}
```
It is recommended to use only one of the functions between setEnable/setDisable.



## License

MIT


