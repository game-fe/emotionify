var detector;
try{
    detector = require('web-detector');
}catch(err){
    //console.log(err);
    detector = {};
}

// 支持的表情的知识库，参考 http://caniemoji.com/
var _support = {
    'macosx': {
        'safari': '10.7',
        'chrome': '10.10',
        'firefox': '10.7'
    },
    'windows': {
        'edge': '10',
        'ie': '7',
        'Firefox': '7'
    },
    'ios': {
        'safari': '5',
        'chrome': '5'
    },
    'android': {
        'chrome': '4.4'
    }
};

function isSupport(){
    if(!detector || !detector.os || !detector.browser){
        return false;
    }
    var osName = detector.os.name;
    var browserName = detector.browser.name;
    var version = detector.browser.version;   
    if(_support[osName] && _support[osName][browserName]){
        if(isNewerOrEqualVersion(_support[osName][browserName], version)){
            return true;
        }
    }
    return false;
}

function isNewerOrEqualVersion(curVer, sysVer){
    if(!curVer){
        return false;
    }
    return versionComparator(curVer, sysVer);

}

function versionComparator(prev, next){
    var splitedPrev = String(prev).split('.');
    var splitedNext = String(next).split('.');
    var prevLen = splitedPrev.length;
    var nextLen = splitedNext.length;
    for(var i = 0; i < prevLen; i++){
        if(parseInt(splitedPrev[i]) > parseInt(splitedNext[i])){
            return false;
        }else if(parseInt(splitedPrev[i]) < parseInt(splitedNext[i])){
            return true;
        }
    }
    if(prevLen > nextLen){
        return false;
    }else{
        return true;
    }
}

module.exports = isSupport;