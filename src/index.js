'use strict';
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
    if (!document || !document.createElement || !document.createElement('canvas').getContext) return false;
    context = document.createElement('canvas').getContext('2d');
    if (typeof context.fillText != 'function') return false;
    smiley = String.fromCodePoint(0x1F604); // :smile: String.fromCharCode(55357) + String.fromCharCode(56835)

    context.textBaseline = "top";
    context.font = "32px Arial";
    context.fillText(smiley, 0, 0);
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