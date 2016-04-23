var Trie = require('./trie.js');
var isSupport = require('./isSupport.js');
var emotions = require('./emotions.js');
var assign = require('object-assign');

function Emotionfy(opt){
    var opt = opt || {};
    this.emotions = opt.emotions || {};
    this._formattedEmotions = formatEmotions(emotions);
    this._trie = buildTrie(this._formattedEmotions);
    this._zhTrie = buildTrie(this._formattedEmotions,true);
}

Emotionfy.prototype ={
    setEmotions:function(emotions){
        this.emotions = assign(this.emotions, opt.emotions || {});
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
        console.log(str);
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
                replace = '<img src="' + emotion.pics['big'] + '" alt="' emotion.name + '" title="' + emotion.name + '">';
            // 判断是否是系统表情，以及是否支持该系统表情
            if((/&#x1F[0-9]{3};/i).test(emotion['code'])){
                if(isSupport()){
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

function emotionfyFactory(){
    return new Emotionfy({emotions:emotions});
}

module.exports = emotionfyFactory;