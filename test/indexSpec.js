describe('method parse2Img', function(){
	it('parse2Img() should parse a string contains code to a string contains image', function(){
		// parse code to img
		var parsedStr = emotionify.parse2Img("#$face_01$#/::)😁");

		var expectedStr = '<img src="http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_01.png" alt="[主播好美]" title="[主播好美]"><img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/0.gif" alt="[微笑]" title="[微笑]">😁';

		expect(parsedStr).toBe(expectedStr);
	});
});

describe('method parse2Code', function(){
	it('parse2Code() should parse a string contains code to a string contains image', function(){
		// parse name to code
		var parsedStr = emotionify.parse2Code('[宝宝方了][微笑][大笑]😁');

		var expectedStr = '#$face_16$#/::)😂😁';

		expect(parsedStr).toEqual(expectedStr);
	});
});

describe('method filterCode', function(){
	it('filterCode() should filter code', function(){
		// parse name to code
		var parsedStr = emotionify.filterCode(emotionify.parse2Code('xxx[宝宝方了][微笑][大笑]xxx'));
		var expectedStr = 'xxx😂xxx';

		expect(parsedStr).toEqual(expectedStr);
	});
});

describe('method addEmotions', function(){
	it('addEmotions() should add data to existing dataset', function(){

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
