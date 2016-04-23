var emotionfyFactory = require('../dist/emotionfyFactory.js');
var emotionfy = emotionfyFactory();
// parse code to img
var parsedImg = emotionfy.parse2Img("#$face_01$#/::)&#x1F600;");
console.log(parsedImg);

// parse name to code
var parsedCode = emotionfy.parse2Code('[宝宝方了][口水][微笑]');
console.log(parsedCode);