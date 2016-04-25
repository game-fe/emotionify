describe('method parse2Img', function(){
	it('parse2Img() should parse a string contains code to a string contains image', function(){
		var emotionify = emotionifyFactory();
		// parse code to img
		var parsedStr = emotionify.parse2Img("#$face_01$#/::)&#x1F600;");

		var expectedStr = '<img src="http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_01.png" alt="[主播好美]" title="[主播好美]"><img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/0.gif" alt="[微笑]" title="[微笑]">&#x1F600;';

		expect(parsedStr).toBe(expectedStr);
	});
});

describe('method parse2Code', function(){
	it('parse2Code() should parse a string contains code to a string contains image', function(){
		var emotionify = emotionifyFactory();
		// parse name to code
		var parsedStr = emotionify.parse2Code('[宝宝方了][微笑][露齿而笑]');

		var expectedStr = '#$face_16$#/::)&#x1F600;';

		expect(parsedStr).toBe(expectedStr);
	});
});

describe('method addEmotions', function(){
	it('addEmotions() should add data to existing dataset', function(){
		var emotionify = emotionifyFactory();

		var newData = {
			'name': 'test',
			'data': [
				{
					'name': 'test',
					'code': '<test>',
					'pics': {

					}
				}
			]
		};
		
		emotionify.addEmotions({'test': newData});

		var getData = emotionify.getEmotions('test');

		expect(newData).toEqual(getData);
	});
});
