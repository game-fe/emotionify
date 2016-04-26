'use strict';
var emotions = require('./emotions.js');//内置表情
var assign = require('object-assign');
var util = require('./util.js');

var _emotions,
    _formattedEmotions,     // 提前处理表情数据，方便后面使用 Trie 算法进行查找
    _trie,                  // code -> obj 的查找树
    _zhTrie,                // name -> obj 的查找树
    _isSupportEmoji = util.doesSupportEmoji();  // 判断浏览器是否支持系统表情

function Emotion(opt){
    var opt = opt || {};
    _emotions = opt.emotions;
    _formattedEmotions = util.formatEmotions(_emotions);
    _trie = util.buildTrie(_formattedEmotions);
    _zhTrie = util.buildTrie(_formattedEmotions,true);
}

Emotion.prototype ={

    addEmotions:function(emotions){
        _emotions = assign(_emotions, emotions || {});
        _formattedEmotions = util.formatEmotions(_emotions);
        _trie = util.buildTrie(_formattedEmotions);
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
            emotionMap = _formattedEmotions.zhMaps;
        for(var i = infos.length-1; i >= 0 ; i--){
            var info = infos[i],
                pos = info[0],
                keyIndex = info[1],
                emotionKey = emotionKeys[keyIndex],
                emotion = emotionMap[emotionKey];
            str = util.splice(str,pos,emotionKey.length,emotion.code);
        }
        return str;
    },

    parse2Img:function(str){
        str = util.utf16ToEntity(util.unescapeHTML(str));

        var infos = _trie.search(str),
            emotionKeys = _formattedEmotions.keys,
            emotionMap = _formattedEmotions.maps;

        for(var i = infos.length-1; i >= 0 ; i--){
            var info = infos[i],
                pos = info[0],
                keyIndex = info[1];
            var emotionKey = emotionKeys[keyIndex],
                emotion = emotionMap[emotionKey],
                replace = '<img src="' + emotion.pics['big'] + '" alt="' + emotion.name + '" title="' + emotion.name + '">';
            // 判断是否是系统表情，以及是否支持该系统表情
            if((/&#x1F[0-9]{3};/i).test(emotion['code'])){
                if(_isSupportEmoji){
                    continue;
                }
            }
            str = util.splice(str,pos,emotionKey.length,replace);
        }
        return str;
    },

    filterCode: function(str){
        str = util.utf16ToEntity(util.unescapeHTML(str));

        var infos = _trie.search(str),
            emotionKeys = _formattedEmotions.keys,
            emotionMap = _formattedEmotions.maps;

        for(var i = infos.length-1; i >= 0 ; i--){
            var info = infos[i],
                pos = info[0],
                keyIndex = info[1];
            var emotionKey = emotionKeys[keyIndex],
                emotion = emotionMap[emotionKey],
                replace = '';
            // 判断是否是系统表情，以及是否支持该系统表情
            if((/&#x1F[0-9]{3};/i).test(emotion['code'])){
                if(_isSupportEmoji){
                    continue;
                }
            }
            str = util.splice(str,pos,emotionKey.length,replace);
        }
        return str;
    }
};

module.exports = new Emotion({emotions: emotions});
