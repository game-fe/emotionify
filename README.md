# emotionify

## api example

### 使用方法
```
var emotionify = emotionifyFactory();
// parse code to img
emotionify.parse2Img("#$face_01$#哈哈/::)&#x1F600;");

// parse name to code
emotionify.parse2Code('[宝宝方了][口水][微笑]');
```

### browser
```
<script src="./dist/emotionifyFactory"></script>
<script>
	参照使用方法
</script>
```

### CommonJS

```
var emotionify = require('emotionify')();
参照使用方法
```

### Amd
```
define('emotionify', function(emotionify){
	参照使用方法
});
```

## method

### parse2Code

### parse2Img

### setEmotions

## data

addEmotions 中参数的数据格式如下：

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
