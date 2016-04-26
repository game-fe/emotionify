'use strict';
require('string.fromcodepoint');
var Trie = require('./trie.js');

function isSystem(code){
   var ranges = [
      '\\ud83c[\\udf00-\\udfff]', // U+1F300 to U+1F3FF   
      '\\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F    
      '\\ud83d[\\ude80-\\udeff]'  // U+1F680 to U+1F6FF
    ];

    return new RegExp(ranges.join('|'), 'g').test(code) || new RegExp('&#x1F[0-9]{3};', 'i').test(code);
}

function entityToUtf16(entity){
  return entity.replace(/&#x(1F[0-9]{3};)/g, function(match, group){
    return fromCodePoint(group);
  });
}

function fromCodePoint(codepoint) {
  var code = typeof codepoint === 'string' ?
        parseInt(codepoint, 16) : codepoint;
  if (code < 0x10000) {
    return fromCharCode(code);
  }
  code -= 0x10000;
  return String.fromCharCode(
    0xD800 + (code >> 10),
    0xDC00 + (code & 0x3FF)
  );
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

function formatUtf16Emotions(emotions){
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
                keys.push(entityToUtf16(emotion.code));
                zhKeys.push(emotion.name);
                emotionMap[entityToUtf16(emotion.code)] = emotion;
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
  entityToUtf16: entityToUtf16,
  formatEmotions: formatEmotions,
  formatUtf16Emotions: formatUtf16Emotions,
  buildTrie: buildTrie,
  splice: splice,
  isSystem: isSystem
};