(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.emotionfyFactory = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* eslint-disable no-unused-vars */
'use strict';
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],2:[function(require,module,exports){
/*! http://mths.be/fromcodepoint v0.2.1 by @mathias */
if (!String.fromCodePoint) {
	(function() {
		var defineProperty = (function() {
			// IE 8 only supports `Object.defineProperty` on DOM elements
			try {
				var object = {};
				var $defineProperty = Object.defineProperty;
				var result = $defineProperty(object, object, object) && $defineProperty;
			} catch(error) {}
			return result;
		}());
		var stringFromCharCode = String.fromCharCode;
		var floor = Math.floor;
		var fromCodePoint = function(_) {
			var MAX_SIZE = 0x4000;
			var codeUnits = [];
			var highSurrogate;
			var lowSurrogate;
			var index = -1;
			var length = arguments.length;
			if (!length) {
				return '';
			}
			var result = '';
			while (++index < length) {
				var codePoint = Number(arguments[index]);
				if (
					!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
					codePoint < 0 || // not a valid Unicode code point
					codePoint > 0x10FFFF || // not a valid Unicode code point
					floor(codePoint) != codePoint // not an integer
				) {
					throw RangeError('Invalid code point: ' + codePoint);
				}
				if (codePoint <= 0xFFFF) { // BMP code point
					codeUnits.push(codePoint);
				} else { // Astral code point; split in surrogate halves
					// http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
					codePoint -= 0x10000;
					highSurrogate = (codePoint >> 10) + 0xD800;
					lowSurrogate = (codePoint % 0x400) + 0xDC00;
					codeUnits.push(highSurrogate, lowSurrogate);
				}
				if (index + 1 == length || codeUnits.length > MAX_SIZE) {
					result += stringFromCharCode.apply(null, codeUnits);
					codeUnits.length = 0;
				}
			}
			return result;
		};
		if (defineProperty) {
			defineProperty(String, 'fromCodePoint', {
				'value': fromCodePoint,
				'configurable': true,
				'writable': true
			});
		} else {
			String.fromCodePoint = fromCodePoint;
		}
	}());
}

},{}],3:[function(require,module,exports){
module.exports ={
    "qq":{
        "name":"QQ表情包",
        "data":[
            {
                "code":"/::)",
                "name":"[微笑]",
                "pics":{
                    "big":"https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/0.gif",
                    "medium":"https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/0.gif",
                    "small": "https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/0.gif"
                }
            },
            {
                "code":"/::~",
                "name":"[瘪嘴]",
                "pics":{
                    "big":"https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/1.gif",
                    "medium":"https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/1.gif",
                    "small": "https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/1.gif"
                }
            },
            {
                "code":"/::B",
                "name":"[口水]",
                "pics":{
                    "big":"https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/2.gif",
                    "medium":"https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/2.gif",
                    "small": "https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/2.gif"
                }
            }
        ]
    },
    'wukong': {
        name: '悟空表情包',
        data: [
            {
                pics: {
                    big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_01.png',
                    medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_01.png',
                    small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_01.png'
                },
                name: '[主播好美]',
                code: '#$face_01$#'
            },
            {
                pics: {
                    big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_02.png',
                    medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_02.png',
                    small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_02.png'
                },
                name: '[圆傻白甜]',
                code: '#$face_02$#'
            },
            {
                pics: {
                    big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_03.png',
                    medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_03.png',
                    small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_03.png'
                },
                name: '[跪求抱抱]',
                code: '#$face_03$#'
            },
            {
                pics: {
                    big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_04.png',
                    medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_04.png',
                    small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_04.png'
                },
                name: '[得意的笑]',
                code: '#$face_04$#'
            },
            {
                pics: {
                    big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_05.png',
                    medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_05.png',
                    small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_05.png'
                },
                name: '[静看装逼]',
                code: '#$face_05$#'
            },
            {
                pics: {
                    big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_06.png',
                    medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_06.png',
                    small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_06.png'
                },
                name: '[诸葛如花]',
                code: '#$face_06$#'
            },
            {
                pics: {
                    big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_07.png',
                    medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_07.png',
                    small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_07.png'
                },
                name: '[恶有恶报]',
                code: '#$face_07$#'
            },
            {
                pics: {
                    big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_08.png',
                    medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_08.png',
                    small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_08.png'
                },
                name: '[污力涛涛]',
                code: '#$face_08$#'
            },
            {
                pics: {
                    big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_09.png',
                    medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_09.png',
                    small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_09.png'
                },
                name: '[有钱任性]',
                code: '#$face_09$#'
            },
            {
                pics: {
                    big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_10.png',
                    medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_10.png',
                    small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_10.png'
                },
                name: '[吓着宝宝]',
                code: '#$face_10$#'
            },
            {
                pics: {
                    big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_11.png',
                    medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_11.png',
                    small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_11.png'
                },
                name: '[媚邪狂狷]',
                code: '#$face_11$#'
            },
            {
                pics: {
                    big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_12.png',
                    medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_12.png',
                    small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_12.png'
                },
                name: '[跟我走吧]',
                code: '#$face_12$#'
            },
            {
                pics: {
                    big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_13.png',
                    medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_13.png',
                    small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_13.png'
                },
                name: '[我心里苦]',
                code: '#$face_13$#'
            },
            {
                pics: {
                    big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_14.png',
                    medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_14.png',
                    small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_14.png'
                },
                name: '[放学别走]',
                code: '#$face_14$#'
            },
            {
                pics: {
                    big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_15.png',
                    medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_15.png',
                    small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_15.png'
                },
                name: '[晚安晚安]',
                code: '#$face_15$#'
            },
            {
                pics: {
                    big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_16.png',
                    medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_16.png',
                    small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_16.png'
                },
                name: '[宝宝方了]',
                code: '#$face_16$#'
            }
        ]
    },
    'system': {
        name: 'system',
        data: [
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f600.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f600.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f600.png'
                },
                name: '[露齿而笑]',
                code: '&#x1F600;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f637.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f637.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f637.png'
                },
                name: '[口罩]',
                code: '&#x1F637;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f602.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f602.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f602.png'
                },
                name: '[大笑]',
                code: '&#x1F602;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f61d.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f61d.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f61d.png'
                },
                name: '[闭眼]',
                code: '&#x1F61D;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f635.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f635.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f635.png'
                },
                name: '[眼冒金星]',
                code: '&#x1F635;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f633.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f633.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f633.png'
                },
                name: '[害羞]',
                code: '&#x1F633;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f631.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f631.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f631.png'
                },
                name: '[恐怖]',
                code: '&#x1F631;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f614.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f614.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f614.png'
                },
                name: '[忧伤]',
                code: '&#x1F614;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f609.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f609.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f609.png'
                },
                name: '[抛媚眼]',
                code: '&#x1F609;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f605.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f605.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f605.png'
                },
                name: '[尴尬]',
                code: '&#x1F605;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f606.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f606.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f606.png'
                },
                name: '[傻笑]',
                code: '&#x1F606;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f607.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f607.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f607.png'
                },
                name: '[天真]',
                code: '&#x1F607;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60a.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60a.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60a.png'
                },
                name: '[害羞]',
                code: '&#x1F60A;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60b.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60b.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60b.png'
                },
                name: '[吐舌头]',
                code: '&#x1F60B;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60d.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60d.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60d.png'
                },
                name: '[犯花痴]',
                code: '&#x1F60D;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60e.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60e.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60e.png'
                },
                name: '[太阳镜]',
                code: '&#x1F60E;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f611.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f611.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f611.png'
                },
                name: '[呆然]',
                code: '&#x1F611;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f615.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f615.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f615.png'
                },
                name: '[撇嘴]',
                code: '&#x1F615;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f616.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f616.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f616.png'
                },
                name: '[困惑]',
                code: '&#x1F616;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f620.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f620.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f620.png'
                },
                name: '[愤怒]',
                code: '&#x1F620;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f621.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f621.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f621.png'
                },
                name: '[发怒]',
                code: '&#x1F621;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f618.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f618.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f618.png'
                },
                name: '[嘟嘴]',
                code: '&#x1F618;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60c.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60c.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60c.png'
                },
                name: '[放松]',
                code: '&#x1F60C;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f612.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f612.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f612.png'
                },
                name: '[犹豫]',
                code: '&#x1F612;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f608.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f608.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f608.png'
                },
                name: '[小恶魔]',
                code: '&#x1F608;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f4aa.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f4aa.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f4aa.png'
                },
                name: '[肌肉]',
                code: '&#x1F4AA;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44d.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44d.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44d.png'
                },
                name: '[赞]',
                code: '&#x1F44D;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44e.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44e.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44e.png'
                },
                name: '[踩]',
                code: '&#x1F44E;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44f.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44f.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44f.png'
                },
                name: '[鼓掌]',
                code: '&#x1F44F;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44c.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44c.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44c.png'
                },
                name: '[好的]',
                code: '&#x1F44C;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f64f.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f64f.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f64f.png'
                },
                name: '[拜]',
                code: '&#x1F64F;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f381.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f381.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f381.png'
                },
                name: '[礼物]',
                code: '&#x1F381;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f389.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f389.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f389.png'
                },
                name: '[庆祝]',
                code: '&#x1F389;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f494.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f494.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f494.png'
                },
                name: '[心碎]',
                code: '&#x1F494;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f493.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f493.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f493.png'
                },
                name: '[跳动的心]',
                code: '&#x1F493;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f49d.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f49d.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f49d.png'
                },
                name: '[爱心]',
                code: '&#x1F49D;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f498.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f498.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f498.png'
                },
                name: '[一见钟情]',
                code: '&#x1F498;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f47b.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f47b.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f47b.png'
                },
                name: '[灵魂]',
                code: '&#x1F47B;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f382.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f382.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f382.png'
                },
                name: '[蛋糕]',
                code: '&#x1F382;'
            },
            {
                pics: {
                    big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f490.png',
                    medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f490.png',
                    small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f490.png'
                },
                name: '[花束]',
                code: '&#x1F490;'
            }
        ]
    }
};
},{}],4:[function(require,module,exports){
require('string.fromcodepoint');
var Trie = require('./trie.js');
var emotions = require('./emotions.js');
var assign = require('object-assign');

// used to unescape HTML special chars in attributes
var unescaper = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&#39;': "'",
  '&quot;': '"'
};

function replacer(m){
    return reunescaper[m];
}

function unescapeHTML(s){
    var reunescapers = [
        '&amp;',
        '&lt;',
        '&gt;',
        '&#39;',
        '&quot;'
    ];

    s = s.replace(new RegExp(reunescapers.join('|'), 'g'), function(m){
        return unescaper[m]
    });
    return s;
}

function utf16ToEntity(s){
    var ranges = [
      '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
      '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
      '\ud83d[\ude80-\udeff]'  // U+1F680 to U+1F6FF
    ];
    s = s.replace(new RegExp(ranges.join('|'), 'g'), function(code){
        return '&#x' + toCodePoint(code).toUpperCase() + ';';
    });

    return s;
}

function doesSupportEmoji() {
    var context, smiley;
    if (!document.createElement('canvas').getContext) return;
    context = document.createElement('canvas').getContext('2d');
    if (typeof context.fillText != 'function') return;
    smile = String.fromCodePoint(0x1F604); // :smile: String.fromCharCode(55357) + String.fromCharCode(56835)

    context.textBaseline = "top";
    context.font = "32px Arial";
    context.fillText(smile, 0, 0);
    return context.getImageData(16, 16, 1, 1).data[0] !== 0;
}

function Emotionfy(opt){
    var opt = opt || {};
    this.emotions = opt.emotions || {};
    this._formattedEmotions = formatEmotions(emotions);
    this._trie = buildTrie(this._formattedEmotions);
    this._zhTrie = buildTrie(this._formattedEmotions,true);
}

Emotionfy.prototype ={
    addEmotions:function(emotions){
        this.emotions = assign(this.emotions, emotions || {});
        this._formattedEmotions = formatEmotions(emotions);
        this._trie = buildTrie(this._formattedEmotions);
        this._zhTrie = buildTrie(this._formattedEmotions,true);
    },

    getEmotions:function(type){

        var _this = this,
            type = type || '';

        if(!type){
            return _this.emotions;
        }else{
            return _this.emotions[type]||{};
        }
    },

    parse2Code:function(str){
        var _this = this,
            infos = _this._zhTrie.search(str),
            emotionKeys = _this._formattedEmotions.zhKeys,
            emotionMap = _this._formattedEmotions.zhMaps;
        for(var i = infos.length-1; i >= 0 ; i--){
            var info = infos[i],
                pos = info[0],
                keyIndex = info[1],
                emotionKey = emotionKeys[keyIndex],
                emotion = emotionMap[emotionKey];
            str = splice(str,pos,emotionKey.length,emotion.code);
        }
        return str;
    },

    parse2Img:function(str){
        str = utf16ToEntity(unescapeHTML(str));

        var _this = this,
            infos = _this._trie.search(str),
            emotionKeys = _this._formattedEmotions.keys,
            emotionMap = _this._formattedEmotions.maps;

        for(var i = infos.length-1; i >= 0 ; i--){
            var info = infos[i],
                pos = info[0],
                keyIndex = info[1];
            var emotionKey = emotionKeys[keyIndex],
                emotion = emotionMap[emotionKey],
                replace = '<img src="' + emotion.pics['big'] + '" alt="' + emotion.name + '" title="' + emotion.name + '">';
            // 判断是否是系统表情，以及是否支持该系统表情
            if((/&#x1F[0-9]{3};/i).test(emotion['code'])){
                if(doesSupportEmoji()){
                    continue;
                }
            }
            str = splice(str,pos,emotionKey.length,replace);
        }
        return str;
    }

};

function buildTrie(emotions,isZh){
    var trie = new Trie();
    trie.build(!!isZh ? emotions.zhKeys : emotions.keys);
    return trie;
}

function splice(str, index, count, add) {
    return str.slice(0, index) + add + str.slice(index + count);
}

function formatEmotions(emotions){
    var keys = [],
        zhKeys = [],
        emotionMap = {},
        emotionZhMap = {};
    for(var type in emotions){
        var ems = emotions[type] || {},
            datas = ems['data'] ||[];
        for(var i=0,len=datas.length;i<len;i++){
            var emotion = datas[i];
            if(!!emotion.code || !!emotion.name){
                keys.push(emotion.code);
                zhKeys.push(emotion.name);
                emotionMap[emotion.code] = emotion;
                emotionZhMap[emotion.name] = emotion;
            }
        }
    }
    return {
        keys:keys,
        zhKeys:zhKeys,
        maps:emotionMap,
        zhMaps:emotionZhMap
    };
}

function toCodePoint(unicodeSurrogates, sep) {
    var
      r = [],
      c = 0,
      p = 0,
      i = 0;
    while (i < unicodeSurrogates.length) {
      c = unicodeSurrogates.charCodeAt(i++);
      if (p) {
        r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16));
        p = 0;
      } else if (0xD800 <= c && c <= 0xDBFF) {
        p = c;
      } else {
        r.push(c.toString(16));
      }
    }
    return r.join(sep || '-');
}

function emotionfyFactory(){
    return new Emotionfy({emotions:emotions});
}

module.exports = emotionfyFactory;
},{"./emotions.js":3,"./trie.js":5,"object-assign":1,"string.fromcodepoint":2}],5:[function(require,module,exports){
function Trie(){
    this.words = 0;
    this.empty = 1;
    this.index = 0;
    this.children = {};
}

Trie.prototype = {
    insert: function(str, pos, idx){
        if(str.length === 0) {
            return;
        }
        var T = this;
        var k;
        var child;

        if(pos === undefined) {
            pos = 0;
        }
        if(pos === str.length) {
            T.index = idx;
            return;
        }
        k = str[pos];
        if(T.children[k] === undefined){
            T.children[k] = new Trie();
            T.empty = 0;
            T.children[k].words = this.words + 1;
        }
        child = T.children[k];
        child.insert(str, pos + 1, idx);
    },

    build: function(arr){
        var len = arr.length;
        for(var i = 0; i < len; i++){
            this.insert(arr[i], 0, i);
        }
    },

    searchOne: function(str, pos){
        if(pos === undefined){
            pos = 0;
        }
        var result = {};
        if(str.length === 0) return result;
        var T = this;
        var child;
        var k;
        result.arr = [];
        k = str[pos];
        child = T.children[k];
        if(child !== undefined && pos < str.length){
            return child.searchOne(str,  pos + 1);
        }
        if(child === undefined && T.empty === 0) return result;
        if(T.empty == 1){
            result.arr[0] = pos - T.words;
            result.arr[1] = T.index;
            result.words = T.words;
            return result;
        }
        return result;
    },

    search: function(str){
        if(this.empty == 1) return [];
        var len = str.length;
        var searchResult = [];
        var tmp;
        for(var i = 0; i < len - 1; i++){
            tmp = this.searchOne(str, i);
            if(typeof tmp.arr !== 'undefined' && tmp.arr.length > 0){
                searchResult.push(tmp.arr);
                i = i + tmp.words - 1;
            }
        }
        return searchResult;
    }
};

module.exports = Trie;
},{}]},{},[4])(4)
});