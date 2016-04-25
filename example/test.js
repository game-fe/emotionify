var emotionifyFactory = require('../dist/emotionifyFactory.js');
var emotionify = emotionifyFactory();
// parse code to img
var parsedImg = emotionify.parse2Img("#$face_01$#/::)&#x1F600;");
console.log(parsedImg);

// parse name to code
var parsedCode = emotionify.parse2Code('[宝宝方了][口水][微笑]');
console.log(parsedCode);