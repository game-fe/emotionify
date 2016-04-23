# emotionfy

## api example

### 使用方法
```
var emotionfy = emotionfyFactory();
// parse code to img
emotionfy.parse2Img("#$face_01$#哈哈/::)&#x1F600;");

// parse name to code
emotionfy.parse2Code('[宝宝方了][口水][微笑]');
```

### browser
```
<script src="./dist/emotionfyFactory"></script>
<script>
	参照使用方法
</script>
```

### CommonJS

```
var emotionfyFactory = require('emotionfyFactory');
参照使用方法
```

### Amd
```
define('emotionfyFactory', function(emotionFactory){
	参照使用方法
});
```

## method

### parse2Code

### parse2Img

### setEmotions

## data

setEmotions 中参数的数据格式如下：

```
{
	type: {
		name: '',
		data: [
			{
				pics: {
				
				},
				name: '',
				code: ''
			},
			{
				pics: {
				
				},
				name: '',
				code: ''
			}
		]
	}
}
```
