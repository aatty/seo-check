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

### Default Rules

1. Detect if any <img /> tag without alt attribute.
2. Detect if any <a /> tag without rel attribute.
3. Detect if there’re more than 15 <strong> tag in HTML
4. Detect if a HTML have more than one <H1> tag.
5. The <head> tag
   - Detect if header doesn’t have <title> tag
   - Detect if header doesn’t have <meta name=“descriptions” ... /> tag
   - Detect if header doesn’t have <meta name=“keywords” ... /> tag

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

## Set custom rules
You can also set custom rules or overwrite the default rule easily
```
const Parse = require('seo-check');  
try{
  // set new rule to check if a HTML have more than two <H2> tag.
  Parse.tag('h2').setRule({'more-han': 2});
  
  // overwrite default rule to check if a HTML have more than three <H2> tag.
  Parse.tag('h1').setRule({'more-han': 3});
  Parse.input('file','./example.html');
  
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


