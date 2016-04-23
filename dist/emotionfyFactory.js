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
"use strict";

const NA_VERSION = "-1";
const NA = {
  name: "na",
  version: NA_VERSION,
};

function typeOf(type){
  return function(object) {
    return Object.prototype.toString.call(object) === "[object " + type + "]";
  };
}
const isString = typeOf("String");
const isRegExp = typeOf("RegExp");
const isObject = typeOf("Object");
const isFunction = typeOf("Function");

function each(object, factory){
  for(let i = 0, l = object.length; i < l; i++){
    if(factory.call(object, object[i], i) === false){
      break;
    }
  }
}

// UserAgent Detector.
// @param {String} ua, userAgent.
// @param {Object} expression
// @return {Object}
//    返回 null 表示当前表达式未匹配成功。
function detect(name, expression, ua) {
  const expr = isFunction(expression) ? expression.call(null, ua) : expression;
  if (!expr) { return null; }
  const info = {
    name: name,
    version: NA_VERSION,
    codename: "",
  };
  if (expr === true) {
    return info;
  }else if(isString(expr)) {
    if(ua.indexOf(expr) !== -1){
      return info;
    }
  } else if (isObject(expr)) {
    if(expr.hasOwnProperty("version")){
      info.version = expr.version;
    }
    return info;
  } else if (isRegExp(expr)) {
    const m = expr.exec(ua);
    if (m) {
      if(m.length >= 2 && m[1]) {
        info.version = m[1].replace(/_/g, ".");
      }else{
        info.version = NA_VERSION;
      }
      return info;
    }
  }
}

// 初始化识别。
function init(ua, patterns, factory, detector){
  let detected = NA;
  each(patterns, function(pattern) {
    const d = detect(pattern[0], pattern[1], ua);
    if (d) {
      detected = d;
      return false;
    }
  });
  factory.call(detector, detected.name, detected.version);
}


class Detector {
  constructor (rules) {
    this._rules = rules;
  }

  // 解析 UserAgent 字符串
  // @param {String} ua, userAgent string.
  // @return {Object}
  parse (ua) {
    ua = (ua || "").toLowerCase();
    const d = {};

    init(ua, this._rules.device, function(name, version) {
      const v = parseFloat(version);
      d.device = {
        name: name,
        version: v,
        fullVersion: version,
      };
      d.device[name] = v;
    }, d);

    init(ua, this._rules.os, function(name, version){
      const v = parseFloat(version);
      d.os = {
        name: name,
        version: v,
        fullVersion: version,
      };
      d.os[name] = v;
    }, d);

    const ieCore = this.IEMode(ua);

    init(ua, this._rules.engine, function(name, version) {
      let mode = version;
      // IE 内核的浏览器，修复版本号及兼容模式。
      if(ieCore){
        version = ieCore.engineVersion || ieCore.engineMode;
        mode = ieCore.engineMode;
      }
      const v = parseFloat(version);
      d.engine = {
        name: name,
        version: v,
        fullVersion: version,
        mode: parseFloat(mode),
        fullMode: mode,
        compatible: ieCore ? ieCore.compatible : false,
      };
      d.engine[name] = v;
    }, d);

    init(ua, this._rules.browser, function(name, version) {
      let mode = version;
      // IE 内核的浏览器，修复浏览器版本及兼容模式。
      if(ieCore){
        // 仅修改 IE 浏览器的版本，其他 IE 内核的版本不修改。
        if(name === "ie"){
          version = ieCore.browserVersion;
        }
        mode = ieCore.browserMode;
      }
      const v = parseFloat(version);
      d.browser = {
        name: name,
        version: v,
        fullVersion: version,
        mode: parseFloat(mode),
        fullMode: mode,
        compatible: ieCore ? ieCore.compatible : false,
      };
      d.browser[name] = v;
    }, d);
    return d;
  }

  // 解析使用 Trident 内核的浏览器的 `浏览器模式` 和 `文档模式` 信息。
  // @param {String} ua, userAgent string.
  // @return {Object}
  IEMode (ua) {
    if(!this._rules.re_msie.test(ua)){ return null; }

    let m;
    let engineMode;
    let engineVersion;
    let browserMode;
    let browserVersion;

    // IE8 及其以上提供有 Trident 信息，
    // 默认的兼容模式，UA 中 Trident 版本不发生变化。
    if(ua.indexOf("trident/") !== -1) {
      m = /\btrident\/([0-9.]+)/.exec(ua);
      if (m && m.length >= 2) {
        // 真实引擎版本。
        engineVersion = m[1];
        const v_version = m[1].split(".");
        v_version[0] = parseInt(v_version[0], 10) + 4;
        browserVersion = v_version.join(".");
      }
    }

    m = this._rules.re_msie.exec(ua);
    browserMode = m[1];
    const v_mode = m[1].split(".");
    if (typeof browserVersion === "undefined") {
      browserVersion = browserMode;
    }
    v_mode[0] = parseInt(v_mode[0], 10) - 4;
    engineMode = v_mode.join(".");
    if (typeof engineVersion === "undefined") {
      engineVersion = engineMode;
    }

    return {
      browserVersion: browserVersion,
      browserMode: browserMode,
      engineVersion: engineVersion,
      engineMode: engineMode,
      compatible: engineVersion !== engineMode,
    };
  }

}

module.exports = Detector;

},{}],3:[function(require,module,exports){
"use strict";

const Detector = require("./detector.js");
const WebRules = require("./web-rules.js");

const userAgent = navigator.userAgent || "";
//const platform = navigator.platform || "";
const appVersion = navigator.appVersion || "";
const vendor = navigator.vendor || "";
const ua = userAgent + " " + appVersion + " " + vendor;

const detector = new Detector(WebRules);

// 解析使用 Trident 内核的浏览器的 `浏览器模式` 和 `文档模式` 信息。
// @param {String} ua, userAgent string.
// @return {Object}
function IEMode(ua){
  if(!WebRules.re_msie.test(ua)){ return null; }

  let m;
  let engineMode;
  let engineVersion;
  let browserMode;
  let browserVersion;

  // IE8 及其以上提供有 Trident 信息，
  // 默认的兼容模式，UA 中 Trident 版本不发生变化。
  if(ua.indexOf("trident/") !== -1){
    m = /\btrident\/([0-9.]+)/.exec(ua);
    if (m && m.length >= 2) {
      // 真实引擎版本。
      engineVersion = m[1];
      const v_version = m[1].split(".");
      v_version[0] = parseInt(v_version[0], 10) + 4;
      browserVersion = v_version.join(".");
    }
  }

  m = WebRules.re_msie.exec(ua);
  browserMode = m[1];
  const v_mode = m[1].split(".");
  if (typeof browserVersion === "undefined") {
    browserVersion = browserMode;
  }
  v_mode[0] = parseInt(v_mode[0], 10) - 4;
  engineMode = v_mode.join(".");
  if (typeof engineVersion === "undefined") {
    engineVersion = engineMode;
  }

  return {
    browserVersion: browserVersion,
    browserMode: browserMode,
    engineVersion: engineVersion,
    engineMode: engineMode,
    compatible: engineVersion !== engineMode,
  };
}

function WebParse (ua) {
  const d = detector.parse(ua);

  const ieCore = IEMode(ua);

  // IE 内核的浏览器，修复版本号及兼容模式。
  if(ieCore) {
    const engineName = d.engine.name;
    const engineVersion = ieCore.engineVersion || ieCore.engineMode;
    const ve = parseFloat(engineVersion);
    const engineMode = ieCore.engineMode;

    d.engine = {
      name: engineName,
      version: ve,
      fullVersion: engineVersion,
      mode: parseFloat(engineMode),
      fullMode: engineMode,
      compatible: ieCore ? ieCore.compatible : false,
    };
    d.engine[d.engine.name] = ve;

    const browserName = d.browser.name;
    // IE 内核的浏览器，修复浏览器版本及兼容模式。
    // 仅修改 IE 浏览器的版本，其他 IE 内核的版本不修改。
    let browserVersion = d.browser.fullVersion;
    if(browserName === "ie"){
      browserVersion = ieCore.browserVersion;
    }
    const browserMode = ieCore.browserMode;
    const vb = parseFloat(browserVersion);
    d.browser = {
      name: browserName,
      version: vb,
      fullVersion: browserVersion,
      mode: parseFloat(browserMode),
      fullMode: browserMode,
      compatible: ieCore ? ieCore.compatible : false,
    };
    d.browser[browserName] = vb;
  }
  return d;
}

const Tan = WebParse(ua);
Tan.parse = WebParse;
module.exports = Tan;

},{"./detector.js":2,"./web-rules.js":4}],4:[function(require,module,exports){
(function (global){
"use strict";

const win = typeof window === "undefined" ? global : window;
const external = win.external;
const re_msie = /\b(?:msie |ie |trident\/[0-9].*rv[ :])([0-9.]+)/;
const re_blackberry_10 = /\bbb10\b.+?\bversion\/([\d.]+)/;
const re_blackberry_6_7 = /\bblackberry\b.+\bversion\/([\d.]+)/;
const re_blackberry_4_5 = /\bblackberry\d+\/([\d.]+)/;

const NA_VERSION = "-1";

// 硬件设备信息识别表达式。
// 使用数组可以按优先级排序。
const DEVICES = [
  ["nokia", function(ua){
    // 不能将两个表达式合并，因为可能出现 "nokia; nokia 960"
    // 这种情况下会优先识别出 nokia/-1
    if(ua.indexOf("nokia ") !== -1){
      return /\bnokia ([0-9]+)?/;
    }else{
      return /\bnokia([a-z0-9]+)?/;
    }
  }],
  // 三星有 Android 和 WP 设备。
  ["samsung", function(ua){
    if(ua.indexOf("samsung") !== -1){
      return /\bsamsung(?:[ \-](?:sgh|gt|sm))?-([a-z0-9]+)/;
    }else{
      return /\b(?:sgh|sch|gt|sm)-([a-z0-9]+)/;
    }
  }],
  ["wp", function(ua){
    return ua.indexOf("windows phone ") !== -1 ||
      ua.indexOf("xblwp") !== -1 ||
      ua.indexOf("zunewp") !== -1 ||
      ua.indexOf("windows ce") !== -1;
  }],
  ["pc", "windows"],
  ["ipad", "ipad"],
  // ipod 规则应置于 iphone 之前。
  ["ipod", "ipod"],
  ["iphone", /\biphone\b|\biph(\d)/],
  ["mac", "macintosh"],
  // 小米
  ["mi", /\bmi[ \-]?([a-z0-9 ]+(?= build|\)))/],
  // 红米
  ["hongmi", /\bhm[ \-]?([a-z0-9]+)/],
  ["aliyun", /\baliyunos\b(?:[\-](\d+))?/],
  ["meizu", function(ua) {
    return ua.indexOf("meizu") >= 0 ?
      /\bmeizu[\/ ]([a-z0-9]+)\b/
      :
      /\bm([0-9cx]{1,4})\b/;
  }],
  ["nexus", /\bnexus ([0-9s.]+)/],
  ["huawei", function(ua) {
    const re_mediapad = /\bmediapad (.+?)(?= build\/huaweimediapad\b)/;
    if(ua.indexOf("huawei-huawei") !== -1){
      return /\bhuawei\-huawei\-([a-z0-9\-]+)/;
    }else if(re_mediapad.test(ua)){
      return re_mediapad;
    }else{
      return /\bhuawei[ _\-]?([a-z0-9]+)/;
    }
  }],
  ["lenovo", function(ua){
    if(ua.indexOf("lenovo-lenovo") !== -1){
      return /\blenovo\-lenovo[ \-]([a-z0-9]+)/;
    }else{
      return /\blenovo[ \-]?([a-z0-9]+)/;
    }
  }],
  // 中兴
  ["zte", function(ua){
    if(/\bzte\-[tu]/.test(ua)){
      return /\bzte-[tu][ _\-]?([a-su-z0-9\+]+)/;
    }else{
      return /\bzte[ _\-]?([a-su-z0-9\+]+)/;
    }
  }],
  // 步步高
  ["vivo", /\bvivo(?: ([a-z0-9]+))?/],
  ["htc", function(ua){
    if(/\bhtc[a-z0-9 _\-]+(?= build\b)/.test(ua)){
      return /\bhtc[ _\-]?([a-z0-9 ]+(?= build))/;
    }else{
      return /\bhtc[ _\-]?([a-z0-9 ]+)/;
    }
  }],
  ["oppo", /\boppo[_]([a-z0-9]+)/],
  ["konka", /\bkonka[_\-]([a-z0-9]+)/],
  ["sonyericsson", /\bmt([a-z0-9]+)/],
  ["coolpad", /\bcoolpad[_ ]?([a-z0-9]+)/],
  ["lg", /\blg[\-]([a-z0-9]+)/],
  ["android", /\bandroid\b|\badr\b/],
  ["blackberry", function(ua){
    if (ua.indexOf("blackberry") >= 0) {
      return /\bblackberry\s?(\d+)/;
    }
    return "bb10";
  }],
];

// 操作系统信息识别表达式
const OS = [
  ["wp", function(ua){
    if(ua.indexOf("windows phone ") !== -1){
      return /\bwindows phone (?:os )?([0-9.]+)/;
    }else if(ua.indexOf("xblwp") !== -1){
      return /\bxblwp([0-9.]+)/;
    }else if(ua.indexOf("zunewp") !== -1){
      return /\bzunewp([0-9.]+)/;
    }
    return "windows phone";
  }],
  ["windows", /\bwindows nt ([0-9.]+)/],
  ["macosx", /\bmac os x ([0-9._]+)/],
  ["ios", function(ua){
    if(/\bcpu(?: iphone)? os /.test(ua)){
      return /\bcpu(?: iphone)? os ([0-9._]+)/;
    }else if(ua.indexOf("iph os ") !== -1){
      return /\biph os ([0-9_]+)/;
    }else{
      return /\bios\b/;
    }
  }],
  ["yunos", /\baliyunos ([0-9.]+)/],
  ["android", function(ua){
    if(ua.indexOf("android") >= 0){
      return /\bandroid[ \/-]?([0-9.x]+)?/;
    }else if(ua.indexOf("adr") >= 0){
      if(ua.indexOf("mqqbrowser") >= 0){
        return /\badr[ ]\(linux; u; ([0-9.]+)?/;
      }else{
        return /\badr(?:[ ]([0-9.]+))?/;
      }
    }
    return "android";
    //return /\b(?:android|\badr)(?:[\/\- ](?:\(linux; u; )?)?([0-9.x]+)?/;
  }],
  ["chromeos", /\bcros i686 ([0-9.]+)/],
  ["linux", "linux"],
  ["windowsce", /\bwindows ce(?: ([0-9.]+))?/],
  ["symbian", /\bsymbian(?:os)?\/([0-9.]+)/],
  ["blackberry", function(ua){
    const m = ua.match(re_blackberry_10) ||
      ua.match(re_blackberry_6_7) ||
      ua.match(re_blackberry_4_5);
    return m ? {version: m[1]} : "blackberry";
  }],
];

// 针对同源的 TheWorld 和 360 的 external 对象进行检测。
// @param {String} key, 关键字，用于检测浏览器的安装路径中出现的关键字。
// @return {Undefined,Boolean,Object} 返回 undefined 或 false 表示检测未命中。
function checkTW360External(key){
  if(!external){ return; } // return undefined.
  try{
    //        360安装路径：
    //        C:%5CPROGRA~1%5C360%5C360se3%5C360SE.exe
    const runpath = external.twGetRunPath.toLowerCase();
    // 360SE 3.x ~ 5.x support.
    // 暴露的 external.twGetVersion 和 external.twGetSecurityID 均为 undefined。
    // 因此只能用 try/catch 而无法使用特性判断。
    const security = external.twGetSecurityID(win);
    const version = external.twGetVersion(security);

    if (runpath && runpath.indexOf(key) === -1) { return false; }
    if (version){return {version: version}; }
  }catch(ex){ /* */ }
}

const ENGINE = [
  ["edgehtml", /edge\/([0-9.]+)/],
  ["trident", re_msie],
  ["blink", function(){
    return "chrome" in win && "CSS" in win && /\bapplewebkit[\/]?([0-9.+]+)/;
  }],
  ["webkit", /\bapplewebkit[\/]?([0-9.+]+)/],
  ["gecko", function(ua){
    const match = ua.match(/\brv:([\d\w.]+).*\bgecko\/(\d+)/);
    if (match) {
      return {
        version: match[1] + "." + match[2],
      };
    }
  }],
  ["presto", /\bpresto\/([0-9.]+)/],
  ["androidwebkit", /\bandroidwebkit\/([0-9.]+)/],
  ["coolpadwebkit", /\bcoolpadwebkit\/([0-9.]+)/],
  ["u2", /\bu2\/([0-9.]+)/],
  ["u3", /\bu3\/([0-9.]+)/],
];
const BROWSER = [
  // Microsoft Edge Browser, Default browser in Windows 10.
  ["edge", /edge\/([0-9.]+)/],
  // Sogou.
  ["sogou", function(ua){
    if (ua.indexOf("sogoumobilebrowser") >= 0) {
      return /sogoumobilebrowser\/([0-9.]+)/;
    } else if (ua.indexOf("sogoumse") >= 0){
      return true;
    }
    return / se ([0-9.x]+)/;
  }],
  // TheWorld (世界之窗)
  // 由于裙带关系，TheWorld API 与 360 高度重合。
  // 只能通过 UA 和程序安装路径中的应用程序名来区分。
  // TheWorld 的 UA 比 360 更靠谱，所有将 TheWorld 的规则放置到 360 之前。
  ["theworld", function(){
    const x = checkTW360External("theworld");
    if(typeof x !== "undefined"){ return x; }
    return /theworld(?: ([\d.])+)?/;
  }],
  // 360SE, 360EE.
  ["360", function(ua) {
    const x = checkTW360External("360se");
    if(typeof x !== "undefined"){ return x; }
    if(ua.indexOf("360 aphone browser") !== -1){
      return /\b360 aphone browser \(([^\)]+)\)/;
    }
    return /\b360(?:se|ee|chrome|browser)\b/;
  }],
  // Maxthon
  ["maxthon", function(){
    try{
      if(external && (external.mxVersion || external.max_version)){
        return {
          version: external.mxVersion || external.max_version,
        };
      }
    }catch(ex){ /* */ }
    return /\b(?:maxthon|mxbrowser)(?:[ \/]([0-9.]+))?/;
  }],
  ["micromessenger", /\bmicromessenger\/([\d.]+)/],
  ["qq", /\bm?qqbrowser\/([0-9.]+)/],
  ["green", "greenbrowser"],
  ["tt", /\btencenttraveler ([0-9.]+)/],
  ["liebao", function(ua){
    if (ua.indexOf("liebaofast") >= 0){
      return /\bliebaofast\/([0-9.]+)/;
    }
    if(ua.indexOf("lbbrowser") === -1){ return false; }
    let version;
    try{
      if(external && external.LiebaoGetVersion){
        version = external.LiebaoGetVersion();
      }
    }catch(ex){ /* */ }
    return {
      version: version || NA_VERSION,
    };
  }],
  ["tao", /\btaobrowser\/([0-9.]+)/],
  ["coolnovo", /\bcoolnovo\/([0-9.]+)/],
  ["saayaa", "saayaa"],
  // 有基于 Chromniun 的急速模式和基于 IE 的兼容模式。必须在 IE 的规则之前。
  ["baidu", /\b(?:ba?idubrowser|baiduhd)[ \/]([0-9.x]+)/],
  // 后面会做修复版本号，这里只要能识别是 IE 即可。
  ["ie", re_msie],
  ["mi", /\bmiuibrowser\/([0-9.]+)/],
  // Opera 15 之后开始使用 Chromniun 内核，需要放在 Chrome 的规则之前。
  ["opera", function(ua){
    const re_opera_old = /\bopera.+version\/([0-9.ab]+)/;
    const re_opera_new = /\bopr\/([0-9.]+)/;
    return re_opera_old.test(ua) ? re_opera_old : re_opera_new;
  }],
  ["oupeng", /\boupeng\/([0-9.]+)/],
  ["yandex", /yabrowser\/([0-9.]+)/],
  // 支付宝手机客户端
  ["ali-ap", function(ua){
    if(ua.indexOf("aliapp") > 0){
      return /\baliapp\(ap\/([0-9.]+)\)/;
    }else{
      return /\balipayclient\/([0-9.]+)\b/;
    }
  }],
  // 支付宝平板客户端
  ["ali-ap-pd", /\baliapp\(ap-pd\/([0-9.]+)\)/],
  // 支付宝商户客户端
  ["ali-am", /\baliapp\(am\/([0-9.]+)\)/],
  // 淘宝手机客户端
  ["ali-tb", /\baliapp\(tb\/([0-9.]+)\)/],
  // 淘宝平板客户端
  ["ali-tb-pd", /\baliapp\(tb-pd\/([0-9.]+)\)/],
  // 天猫手机客户端
  ["ali-tm", /\baliapp\(tm\/([0-9.]+)\)/],
  // 天猫平板客户端
  ["ali-tm-pd", /\baliapp\(tm-pd\/([0-9.]+)\)/],
  // UC 浏览器，可能会被识别为 Android 浏览器，规则需要前置。
  // UC 桌面版浏览器携带 Chrome 信息，需要放在 Chrome 之前。
  ["uc", function(ua){
    if(ua.indexOf("ucbrowser/") >= 0){
      return /\bucbrowser\/([0-9.]+)/;
    } else if(ua.indexOf("ubrowser/") >= 0){
      return /\bubrowser\/([0-9.]+)/;
    }else if(/\buc\/[0-9]/.test(ua)){
      return /\buc\/([0-9.]+)/;
    }else if(ua.indexOf("ucweb") >= 0){
      // `ucweb/2.0` is compony info.
      // `UCWEB8.7.2.214/145/800` is browser info.
      return /\bucweb([0-9.]+)?/;
    }else{
      return /\b(?:ucbrowser|uc)\b/;
    }
  }],
  ["chrome", / (?:chrome|crios|crmo)\/([0-9.]+)/],
  // Android 默认浏览器。该规则需要在 safari 之前。
  ["android", function(ua){
    if(ua.indexOf("android") === -1){ return; }
    return /\bversion\/([0-9.]+(?: beta)?)/;
  }],
  ["blackberry", function(ua){
    const m = ua.match(re_blackberry_10) ||
      ua.match(re_blackberry_6_7) ||
      ua.match(re_blackberry_4_5);
    return m ? {version: m[1]} : "blackberry";
  }],
  ["safari", /\bversion\/([0-9.]+(?: beta)?)(?: mobile(?:\/[a-z0-9]+)?)? safari\//],
  // 如果不能被识别为 Safari，则猜测是 WebView。
  ["webview", /\bcpu(?: iphone)? os (?:[0-9._]+).+\bapplewebkit\b/],
  ["firefox", /\bfirefox\/([0-9.ab]+)/],
  ["nokia", /\bnokiabrowser\/([0-9.]+)/],
];

module.exports = {
  device: DEVICES,
  os: OS,
  browser: BROWSER,
  engine: ENGINE,
  re_msie: re_msie,
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
"use strict";

module.exports = {
    "qq": {
        "name": "QQ表情包",
        "data": [{
            "code": "/::)",
            "name": "[微笑]",
            "pics": {
                "big": "https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/0.gif",
                "medium": "https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/0.gif"
            }
        }, {
            "code": "/::~",
            "name": "[瘪嘴]",
            "pics": {
                "big": "https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/1.gif",
                "medium": "https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/1.gif"
            }
        }, {
            "code": "/::B",
            "name": "[口水]",
            "pics": {
                "big": "https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/2.gif",
                "medium": "https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/2.gif"
            }
        }]
    },
    'wukong': {
        name: '悟空表情包',
        data: [{
            pics: {
                big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_01.png',
                medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_01.png',
                small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_01.png'
            },
            name: '[主播好美]',
            code: '#$face_01$#'
        }, {
            pics: {
                big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_02.png',
                medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_02.png',
                small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_02.png'
            },
            name: '[圆傻白甜]',
            code: '#$face_02$#'
        }, {
            pics: {
                big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_03.png',
                medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_03.png',
                small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_03.png'
            },
            name: '[跪求抱抱]',
            code: '#$face_03$#'
        }, {
            pics: {
                big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_04.png',
                medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_04.png',
                small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_04.png'
            },
            name: '[得意的笑]',
            code: '#$face_04$#'
        }, {
            pics: {
                big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_05.png',
                medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_05.png',
                small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_05.png'
            },
            name: '[静看装逼]',
            code: '#$face_05$#'
        }, {
            pics: {
                big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_06.png',
                medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_06.png',
                small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_06.png'
            },
            name: '[诸葛如花]',
            code: '#$face_06$#'
        }, {
            pics: {
                big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_07.png',
                medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_07.png',
                small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_07.png'
            },
            name: '[恶有恶报]',
            code: '#$face_07$#'
        }, {
            pics: {
                big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_08.png',
                medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_08.png',
                small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_08.png'
            },
            name: '[污力涛涛]',
            code: '#$face_08$#'
        }, {
            pics: {
                big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_09.png',
                medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_09.png',
                small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_09.png'
            },
            name: '[有钱任性]',
            code: '#$face_09$#'
        }, {
            pics: {
                big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_10.png',
                medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_10.png',
                small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_10.png'
            },
            name: '[吓着宝宝]',
            code: '#$face_10$#'
        }, {
            pics: {
                big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_11.png',
                medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_11.png',
                small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_11.png'
            },
            name: '[媚邪狂狷]',
            code: '#$face_11$#'
        }, {
            pics: {
                big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_12.png',
                medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_12.png',
                small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_12.png'
            },
            name: '[跟我走吧]',
            code: '#$face_12$#'
        }, {
            pics: {
                big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_13.png',
                medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_13.png',
                small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_13.png'
            },
            name: '[我心里苦]',
            code: '#$face_13$#'
        }, {
            pics: {
                big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_14.png',
                medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_14.png',
                small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_14.png'
            },
            name: '[放学别走]',
            code: '#$face_14$#'
        }, {
            pics: {
                big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_15.png',
                medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_15.png',
                small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_15.png'
            },
            name: '[晚安晚安]',
            code: '#$face_15$#'
        }, {
            pics: {
                big: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_16.png',
                medium: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_16.png',
                small: 'http://p1.qhimg.com/d/inn/f5c6160c/wukong/face_16.png'
            },
            name: '[宝宝方了]',
            code: '#$face_16$#'
        }]
    },
    'system': {
        name: 'system',
        data: [{
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f600.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f600.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f600.png'
            },
            name: '[露齿而笑]',
            code: '&#x1F600;'
        },

        // test
        {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f600.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f600.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f600.png'
            },
            name: '[露而笑]',
            code: '&#x1F600;'
        },
        // test

        {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f637.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f637.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f637.png'
            },
            name: '[口罩]',
            code: '&#x1F637;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f602.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f602.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f602.png'
            },
            name: '[大笑]',
            code: '&#x1F602;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f61d.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f61d.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f61d.png'
            },
            name: '[闭眼]',
            code: '&#x1F61D;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f635.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f635.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f635.png'
            },
            name: '[眼冒金星]',
            code: '&#x1F635;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f633.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f633.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f633.png'
            },
            name: '[害羞]',
            code: '&#x1F633;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f631.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f631.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f631.png'
            },
            name: '[恐怖]',
            code: '&#x1F631;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f614.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f614.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f614.png'
            },
            name: '[忧伤]',
            code: '&#x1F614;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f609.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f609.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f609.png'
            },
            name: '[抛媚眼]',
            code: '&#x1F609;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f605.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f605.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f605.png'
            },
            name: '[尴尬]',
            code: '&#x1F605;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f606.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f606.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f606.png'
            },
            name: '[傻笑]',
            code: '&#x1F606;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f607.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f607.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f607.png'
            },
            name: '[天真]',
            code: '&#x1F607;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60a.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60a.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60a.png'
            },
            name: '[害羞]',
            code: '&#x1F60A;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60b.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60b.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60b.png'
            },
            name: '[吐舌头]',
            code: '&#x1F60B;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60d.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60d.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60d.png'
            },
            name: '[犯花痴]',
            code: '&#x1F60D;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60e.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60e.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60e.png'
            },
            name: '[太阳镜]',
            code: '&#x1F60E;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f611.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f611.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f611.png'
            },
            name: '[呆然]',
            code: '&#x1F611;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f615.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f615.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f615.png'
            },
            name: '[撇嘴]',
            code: '&#x1F615;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f616.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f616.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f616.png'
            },
            name: '[困惑]',
            code: '&#x1F616;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f620.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f620.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f620.png'
            },
            name: '[愤怒]',
            code: '&#x1F620;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f621.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f621.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f621.png'
            },
            name: '[发怒]',
            code: '&#x1F621;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f618.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f618.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f618.png'
            },
            name: '[嘟嘴]',
            code: '&#x1F618;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60c.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60c.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f60c.png'
            },
            name: '[放松]',
            code: '&#x1F60C;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f612.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f612.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f612.png'
            },
            name: '[犹豫]',
            code: '&#x1F612;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f608.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f608.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f608.png'
            },
            name: '[小恶魔]',
            code: '&#x1F608;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f4aa.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f4aa.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f4aa.png'
            },
            name: '[肌肉]',
            code: '&#x1F4AA;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44d.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44d.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44d.png'
            },
            name: '[赞]',
            code: '&#x1F44D;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44e.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44e.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44e.png'
            },
            name: '[踩]',
            code: '&#x1F44E;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44f.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44f.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44f.png'
            },
            name: '[鼓掌]',
            code: '&#x1F44F;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44c.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44c.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f44c.png'
            },
            name: '[好的]',
            code: '&#x1F44C;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f64f.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f64f.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f64f.png'
            },
            name: '[拜]',
            code: '&#x1F64F;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f381.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f381.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f381.png'
            },
            name: '[礼物]',
            code: '&#x1F381;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f389.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f389.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f389.png'
            },
            name: '[庆祝]',
            code: '&#x1F389;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f494.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f494.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f494.png'
            },
            name: '[心碎]',
            code: '&#x1F494;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f493.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f493.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f493.png'
            },
            name: '[跳动的心]',
            code: '&#x1F493;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f49d.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f49d.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f49d.png'
            },
            name: '[爱心]',
            code: '&#x1F49D;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f498.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f498.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f498.png'
            },
            name: '[一见钟情]',
            code: '&#x1F498;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f47b.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f47b.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f47b.png'
            },
            name: '[灵魂]',
            code: '&#x1F47B;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f382.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f382.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f382.png'
            },
            name: '[蛋糕]',
            code: '&#x1F382;'
        }, {
            pics: {
                big: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f490.png',
                medium: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f490.png',
                small: 'http://p5.qhimg.com/d/inn/fa34a89c/emoji/1f490.png'
            },
            name: '[花束]',
            code: '&#x1F490;'
        }]
    }
};

},{}],6:[function(require,module,exports){
'use strict';

var Trie = require('./trie.js');
var isSupport = require('./isSupport.js');
var emotions = require('./emotions.js');
var assign = require('object-assign');

function Emotionfy(opt) {
    var opt = opt || {};
    this.emotions = opt.emotions || {};
    this._formattedEmotions = formatEmotions(emotions);
    this._trie = buildTrie(this._formattedEmotions);
    this._zhTrie = buildTrie(this._formattedEmotions, true);
}

Emotionfy.prototype = {
    setEmotions: function setEmotions(emotions) {
        this.emotions = assign(this.emotions, opt.emotions || {});
        this._formattedEmotions = formatEmotions(emotions);
        this._trie = buildTrie(this._formattedEmotions);
        this._zhTrie = buildTrie(this._formattedEmotions, true);
    },

    getEmotions: function getEmotions(type) {

        var _this = this,
            type = type || '';

        if (!type) {
            return _this.emotions;
        } else {
            return _this.emotions[type] || {};
        }
    },

    parse2Code: function parse2Code(str) {
        var _this = this,
            infos = _this._zhTrie.search(str),
            emotionKeys = _this._formattedEmotions.zhKeys,
            emotionMap = _this._formattedEmotions.zhMaps;
        for (var i = infos.length - 1; i >= 0; i--) {
            var info = infos[i],
                pos = info[0],
                keyIndex = info[1],
                emotionKey = emotionKeys[keyIndex],
                emotion = emotionMap[emotionKey];
            str = splice(str, pos, emotionKey.length, emotion.code);
        }
        return str;
    },

    parse2Img: function parse2Img(str) {
        var ranges = ['�[�-�]', // U+1F300 to U+1F3FF
        '�[�-�]', // U+1F400 to U+1F64F
        '�[�-�]' // U+1F680 to U+1F6FF
        ];
        var str = str.replace(new RegExp(ranges.join('|'), 'g'), function (code) {
            return '&#x' + toCodePoint(code).toUpperCase() + ';';
        });

        var _this = this,
            infos = _this._trie.search(str),
            emotionKeys = _this._formattedEmotions.keys,
            emotionMap = _this._formattedEmotions.maps;

        for (var i = infos.length - 1; i >= 0; i--) {
            var info = infos[i],
                pos = info[0],
                keyIndex = info[1];
            var emotionKey = emotionKeys[keyIndex],
                emotion = emotionMap[emotionKey],
                replace = '<img src="' + emotion.pics['big'] + '" alt="' + emotion.name + '" title="' + emotion.name + '">';
            // 判断是否是系统表情，以及是否支持该系统表情
            if (/&#x1F[0-9]{3};/i.test(emotion['code'])) {
                if (isSupport()) {
                    continue;
                }
            }
            str = splice(str, pos, emotionKey.length, replace);
        }
        return str;
    }

};

function buildTrie(emotions, isZh) {
    var trie = new Trie();
    trie.build(!!isZh ? emotions.zhKeys : emotions.keys);
    return trie;
}

function splice(str, index, count, add) {
    return str.slice(0, index) + add + str.slice(index + count);
}

function formatEmotions(emotions) {
    var keys = [],
        zhKeys = [],
        emotionMap = {},
        emotionZhMap = {};
    for (var type in emotions) {
        var ems = emotions[type] || {},
            datas = ems['data'] || [];
        for (var i = 0, len = datas.length; i < len; i++) {
            var emotion = datas[i];
            if (!!emotion.code || !!emotion.name) {
                keys.push(emotion.code);
                zhKeys.push(emotion.name);
                emotionMap[emotion.code] = emotion;
                emotionZhMap[emotion.name] = emotion;
            }
        }
    }
    return {
        keys: keys,
        zhKeys: zhKeys,
        maps: emotionMap,
        zhMaps: emotionZhMap
    };
}

function toCodePoint(unicodeSurrogates, sep) {
    var r = [],
        c = 0,
        p = 0,
        i = 0;
    while (i < unicodeSurrogates.length) {
        c = unicodeSurrogates.charCodeAt(i++);
        if (p) {
            r.push((0x10000 + (p - 0xD800 << 10) + (c - 0xDC00)).toString(16));
            p = 0;
        } else if (0xD800 <= c && c <= 0xDBFF) {
            p = c;
        } else {
            r.push(c.toString(16));
        }
    }
    return r.join(sep || '-');
}

function emotionfyFactory() {
    return new Emotionfy({ emotions: emotions });
}

module.exports = emotionfyFactory;

},{"./emotions.js":5,"./isSupport.js":7,"./trie.js":8,"object-assign":1}],7:[function(require,module,exports){
'use strict';

var detector;
try {
    detector = require('web-detector');
} catch (err) {
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

function isSupport() {
    if (!detector || !detector.os || !detector.browser) {
        return false;
    }
    var osName = detector.os.name;
    var browserName = detector.browser.name;
    var version = detector.browser.version;
    if (_support[osName] && _support[osName][browserName]) {
        if (isNewerOrEqualVersion(_support[osName][browserName], version)) {
            return true;
        }
    }
    return false;
}

function isNewerOrEqualVersion(curVer, sysVer) {
    if (!curVer) {
        return false;
    }
    return versionComparator(curVer, sysVer);
}

function versionComparator(prev, next) {
    var splitedPrev = String(prev).split('.');
    var splitedNext = String(next).split('.');
    var prevLen = splitedPrev.length;
    var nextLen = splitedNext.length;
    for (var i = 0; i < prevLen; i++) {
        if (parseInt(splitedPrev[i]) > parseInt(splitedNext[i])) {
            return false;
        } else if (parseInt(splitedPrev[i]) < parseInt(splitedNext[i])) {
            return true;
        }
    }
    if (prevLen > nextLen) {
        return false;
    } else {
        return true;
    }
}

module.exports = isSupport;

},{"web-detector":3}],8:[function(require,module,exports){
'use strict';

function Trie() {
    this.words = 0;
    this.empty = 1;
    this.index = 0;
    this.children = {};
}

Trie.prototype = {
    insert: function insert(str, pos, idx) {
        if (str.length === 0) {
            return;
        }
        var T = this;
        var k;
        var child;

        if (pos === undefined) {
            pos = 0;
        }
        if (pos === str.length) {
            T.index = idx;
            return;
        }
        k = str[pos];
        if (T.children[k] === undefined) {
            T.children[k] = new Trie();
            T.empty = 0;
            T.children[k].words = this.words + 1;
        }
        child = T.children[k];
        child.insert(str, pos + 1, idx);
    },

    build: function build(arr) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            this.insert(arr[i], 0, i);
        }
    },

    searchOne: function searchOne(str, pos) {
        if (pos === undefined) {
            pos = 0;
        }
        var result = {};
        if (str.length === 0) return result;
        var T = this;
        var child;
        var k;
        result.arr = [];
        k = str[pos];
        child = T.children[k];
        if (child !== undefined && pos < str.length) {
            return child.searchOne(str, pos + 1);
        }
        if (child === undefined && T.empty === 0) return result;
        if (T.empty == 1) {
            result.arr[0] = pos - T.words;
            result.arr[1] = T.index;
            result.words = T.words;
            return result;
        }
        return result;
    },

    search: function search(str) {
        if (this.empty == 1) return [];
        var len = str.length;
        var searchResult = [];
        var tmp;
        for (var i = 0; i < len - 1; i++) {
            tmp = this.searchOne(str, i);
            if (typeof tmp.arr !== 'undefined' && tmp.arr.length > 0) {
                searchResult.push(tmp.arr);
                i = i + tmp.words - 1;
            }
        }
        return searchResult;
    }
};

module.exports = Trie;

},{}]},{},[6])(6)
});