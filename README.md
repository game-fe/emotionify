# emotionfy

## api example

```
var emotionfyFactory = require('emotionfyFactory');
var emotionfy = emotionfyFactory();
// parse code to img
emotionfy.parse2Img("#$face_01$#哈哈/::)&#x1F600;");

// parse name to code
emotionfy.parse2Code('[宝宝方了][口水][微笑]');
```

## method

### parse2Code

