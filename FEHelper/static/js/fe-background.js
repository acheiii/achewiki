var BgPageInstance=(function(){var j={css:false,js:false,html:true,allDone:false};var o=null;var b=function(){o=window.setInterval(function(){if(j.css&&j.js&&j.html){j.allDone=true;window.clearInterval(o)}},100)};var a=function(r){if(j.allDone){chrome.tabs.sendMessage(r.id,{type:MSG_TYPE.BROWSER_CLICKED,event:MSG_TYPE.FCP_HELPER_DETECT})}else{baidu.feNotification.notifyText({message:"正在准备数据，请稍等..."})}};var p=function(r){chrome.tabs.sendMessage(r.id,{type:MSG_TYPE.BROWSER_CLICKED,event:MSG_TYPE.GRID_DETECT})};var g=[];var q=function(r){chrome.tabs.query({active:true,currentWindow:true},function(s){var t=s[0];try{g[t.id].cancel()}catch(u){}if(!r){baidu.feNotification.notifyText({message:"对不起，检测失败"})}else{if(window.webkitNotifications&&webkitNotifications.createHTMLNotification){baidu.feNotification.notifyHtml("template/fehelper_wpo.html?"+JSON.stringify(r))}else{chrome.tabs.create({url:"template/fehelper_wpo.html?"+JSON.stringify(r),active:true})}}})};var f=function(){chrome.tabs.query({active:true,currentWindow:true},function(r){var s=r[0];g[s.id]=baidu.feNotification.notifyText({message:"正在统计，请稍后...",autoClose:false});chrome.tabs.sendMessage(s.id,{type:MSG_TYPE.GET_PAGE_WPO_INFO})})};var i=function(){chrome.tabs.query({active:true,currentWindow:true},function(r){var s=r[0];chrome.tabs.executeScript(s.id,{code:"void function(t,r,a,c,k){t.tracker_type='bm';t.tracker_uid='fehelper';(k=t.TrackerGlobalEvent)?k.f(r):[(k=t[a]('script')).charset='utf-8',k.src='http://www.ucren.com/'+c+'/'+c+'.js?'+Math.random(),t.documentElement.appendChild(k)]}(document,'TrackerJSLoad','createElement','tracker') ",allFrames:false,runAt:"document_end"})})};var k=function(){var r="http://www.baidufe.com/fehelper/codecompress.html";chrome.tabs.query({windowId:chrome.windows.WINDOW_ID_CURRENT},function(v){var x=false;var t;var w=new RegExp("fehelper.*codecompress.html$","i");for(var u=0,s=v.length;u<s;u++){if(w.test(v[u].url)){x=true;t=v[u].id;break}}if(!x){chrome.tabs.create({url:r,active:true})}else{chrome.tabs.update(t,{highlighted:true})}})};var d=function(s,r){chrome.tabs.query({windowId:chrome.windows.WINDOW_ID_CURRENT},function(w){var y=false;var u;var x=new RegExp("^chrome.*"+r+".html$","i");for(var v=0,t=w.length;v<t;v++){if(x.test(w[v].url)){y=true;u=w[v].id;break}}if(!y){chrome.tabs.create({url:"template/fehelper_"+r+".html",active:true})}else{chrome.tabs.update(u,{highlighted:true})}})};var e=function(r){chrome.tabs.query({active:true,currentWindow:true},function(s){var t=s[0];if(r.useFile=="1"){d(t,r.msgType)}else{switch(r.msgType){case MSG_TYPE.FCP_HELPER_DETECT:a(t);break;case MSG_TYPE.GRID_DETECT:p(t);break;case MSG_TYPE.SHOW_PAGE_LOAD_TIME:f();break;case MSG_TYPE.JS_TRACKER:i();break;case MSG_TYPE.CODE_COMPRESS:k();break}}})};var l=function(){c();baidu.contextMenuId=chrome.contextMenus.create({title:"FeHelper"});chrome.contextMenus.create({title:"JSON格式化",parentId:baidu.contextMenuId,onclick:function(s,r){d(r,"jsonformat")}});chrome.contextMenus.create({title:"字符串编解码",parentId:baidu.contextMenuId,onclick:function(s,r){d(r,"endecode")}});chrome.contextMenus.create({title:"二维码生成",parentId:baidu.contextMenuId,onclick:function(s,r){d(r,"qrcode")}});chrome.contextMenus.create({title:"代码美化工具",parentId:baidu.contextMenuId,onclick:function(s,r){d(r,"codebeautify")}})};var c=function(){if(!baidu.contextMenuId){return}chrome.contextMenus.remove(baidu.contextMenuId);baidu.contextMenuId=null};var h=function(){if(baidu.feOption.getOptionItem("opt_item_contextMenus")!=="false"){l()}else{c()}};var n=function(){chrome.runtime.onMessage.addListener(function(s,r,t){if(s.type==MSG_TYPE.GET_CSS){baidu.network.readFileContent(s.link,t)}else{if(s.type==MSG_TYPE.GET_JS){baidu.network.readFileContent(s.link,t)}else{if(s.type==MSG_TYPE.GET_HTML){baidu.network.readFileContent(s.link,t)}else{if(s.type==MSG_TYPE.GET_COOKIE){baidu.network.getCookies(s,t)}else{if(s.type==MSG_TYPE.REMOVE_COOKIE){baidu.network.removeCookie(s,t)}else{if(s.type==MSG_TYPE.SET_COOKIE){baidu.network.setCookie(s,t)}else{if(s.type==MSG_TYPE.CSS_READY){j.css=true}else{if(s.type==MSG_TYPE.JS_READY){j.js=true}else{if(s.type==MSG_TYPE.HTML_READY){j.html=true}else{if(s.type==MSG_TYPE.GET_OPTIONS){baidu.feOption.doGetOptions(s.items,t)}else{if(s.type==MSG_TYPE.SET_OPTIONS){baidu.feOption.doSetOptions(s.items,t);h()}else{if(s.type==MSG_TYPE.CALC_PAGE_LOAD_TIME){q(s.wpo)}else{if(s.type==MSG_TYPE.FROM_POPUP){e(s.config)}}}}}}}}}}}}}return true})};var m=function(){n();b();h()};return{init:m,runHelper:e}})();BgPageInstance.init();