'use strict';
require('string.fromcodepoint');
var Trie = require('./trie.js');

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
      '\\ud83c[\\udf00-\\udfff]', // U+1F300 to U+1F3FF
      '\\ud83d[\\udc00-\\ude4f]', // U+1F400 to U+1F64F
      '\\ud83d[\\ude80-\\udeff]'  // U+1F680 to U+1F6FF
    ];
    s = s.replace(new RegExp(ranges.join('|'), 'g'), function(code){
        return '&#x' + toCodePoint(code).toUpperCase() + ';';
    });

    return s;
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

function buildTrie(emotions,isZh){
    var trie = new Trie();
    trie.build(!!isZh ? emotions.zhKeys : emotions.keys);
    return trie;
}

function splice(str, index, count, add) {
    return str.slice(0, index) + add + str.slice(index + count);
}

module.exports = {
  doesSupportEmoji: doesSupportEmoji,
  unescapeHTML: unescapeHTML,
  utf16ToEntity: utf16ToEntity,
  formatEmotions: formatEmotions,
  buildTrie: buildTrie,
  splice: splice
};