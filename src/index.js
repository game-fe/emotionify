'use strict';
var emotions = require('./emotions.js');//内置表情
var assign = require('object-assign');
var util = require('./util.js');

var _emotions,
    _formattedEmotions,     // 提前处理表情数据，方便后面使用 Trie 算法进行查找
    _formattedUtf16Emotions,
    _trie,                  // code -> obj 的查找树
    _utf16Trie,
    _zhTrie,                // name -> obj 的查找树
    _isSupportEmoji = util.doesSupportEmoji();  // 判断浏览器是否支持系统表情

function Emotion(opt){
    var opt = opt || {};
    _emotions = opt.emotions;
    _formattedEmotions = util.formatEmotions(_emotions);
    _formattedUtf16Emotions = util.formatUtf16Emotions(_emotions);
    _trie = util.buildTrie(_formattedEmotions);
    _utf16Trie = util.buildTrie(_formattedUtf16Emotions);
    _zhTrie = util.buildTrie(_formattedEmotions,true);
}

Emotion.prototype ={

    addEmotions:function(emotions){
        _emotions = assign(_emotions, emotions || {});
        _formattedEmotions = util.formatEmotions(_emotions);
        _formattedUtf16Emotions = util.formatUtf16Emotions(_emotions);
        _trie = util.buildTrie(_formattedEmotions);
        _utf16Trie = util.buildTrie(_formattedUtf16Emotions);
        _zhTrie = util.buildTrie(_formattedEmotions,true);
    },

    getEmotions:function(type){

        var _this = this,
            type = type || '';

        if(!type){
            return _emotions;
        }else{
            return _emotions[type]||{};
        }
    },

    parse2Code:function(str){
        var _this = this,
            infos = _zhTrie.search(str),
            emotionKeys = _formattedEmotions.zhKeys,
            emotionMaps = _formattedEmotions.zhMaps;
        for(var i = infos.length-1; i >= 0 ; i--){
            var info = infos[i],
                pos = info[0],
                keyIndex = info[1],
                emotionKey = emotionKeys[keyIndex],
                emotion = emotionMaps[emotionKey];
            // 判断是否是通过实体的方式表示的 emoji 表情
            if(util.isSystem(emotion.code)){
                emotion.code = util.entityToUtf16(emotion.code);
            }
            str = util.splice(str,pos,emotionKey.length,emotion.code);
        }
        return str;
    },

    parse2Img:function(str){
        var infos = _trie.search(str),
            emotionUtf16Keys = _formattedUtf16Emotions.keys,
            emotionUtf16Maps = _formattedUtf16Emotions.maps;

        for(var i = infos.length-1; i >= 0 ; i--){
            var info = infos[i],
                pos = info[0],
                keyIndex = info[1];
            var emotionKey = emotionUtf16Keys[keyIndex],
                emotion = emotionUtf16Maps[emotionKey],
                replace = '<img src="' + emotion.pics['big'] + '" alt="' + emotion.name + '" title="' + emotion.name + '">';
            // 判断是否是系统表情，以及是否支持该系统表情
            if(_isSupportEmoji && util.isSystem(emotion.code)){
                continue;
            }
            str = util.splice(str,pos,emotionKey.length,replace);
        }
        return str;
    },

    filterCode: function(str){
        var infos = _trie.search(str),
            emotionUtf16Keys = _formattedUtf16Emotions.keys,
            emotionUtf16Maps = _formattedUtf16Emotions.maps;

        for(var i = infos.length-1; i >= 0 ; i--){
            var info = infos[i],
                pos = info[0],
                keyIndex = info[1];
            var emotionKey = emotionUtf16Keys[keyIndex],
                emotion = emotionUtf16Maps[emotionKey];
            // 判断是否是系统表情，以及是否支持该系统表情
            if(_isSupportEmoji && util.isSystem(emotion.code)){
                continue;
            }
            str = util.splice(str,pos,emotionKey.length,'');
        }
        return str;
    }
};

module.exports = new Emotion({emotions: emotions});
