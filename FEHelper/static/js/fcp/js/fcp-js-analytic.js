baidu.namespace.register("baidu.jsAnalytic");baidu.jsAnalytic=function(){this.parsePos=0;this.content="";this.contentLength=0;this._output=[];this._whitespace=/[\n\r\t\s]/g;this._wordchar=/[a-zA-Z0-9_\$]/g;this._digits=/[0-9]/g;this._punct=/\+|-|\*|\/|%|&|\+\+|\-\-|=|\+=|\-=|\*=|\/=|%=|==|===|!=|!==|>|<|>=|<=|>>|<<|>>>|>>>=|>>=|<<=|&&|&=|\||\|\||!|!!|,|:|\?|\^|\^=|_|\|=|::/g;this.run=function(a){this.content=a.trim().replace(/\r\n/g,"\n");this.contentLength=this.content.length;this.tokenAnalytic();return this._output};this.tokenAnalytic=function(){while(true){$token=this.getNextToken();if($token){if($token[1]===baidu.FL.FL_EOF){break}this._output.push($token)}}};this._is_match=function(a,b){return b.test(a)};this.getNextToken=function(){if(this.parsePos>=this.contentLength){return["",baidu.FL.FL_EOF]}var a=this.content[this.parsePos];var e,b,f,d;this.parsePos++;while(this._is_match(a,this._whitespace)){if(this.parsePos>=this.contentLength){return["",baidu.FL.FL_EOF]}if(a==="\x0d"){return""}if(a==="\x0a"){return[a,baidu.FL.FL_NEW_LINE]}a=this.content[this.parsePos];this.parsePos++}if(this._is_match(a,this._wordchar)){e=this._getWordToken(a);if(e){return e}}switch(true){case a==="("||a==="[":return[a,baidu.FL.JS_START_EXPR];case a===")"||a==="]":return[a,baidu.FL.JS_END_EXPR];case a==="{":return[a,baidu.FL.JS_START_BLOCK];case a==="}":return[a,baidu.FL.JS_END_BLOCK];case a===";":return[a,baidu.FL.JS_SEMICOLON]}if(a==="/"){e=this._getCommentToken(a);if(e){return e}b=this._output.length;if(b){var c=this._output[b-1];f=c[0];d=c[1]}else{d=baidu.FL.JS_START_EXPR}if((d===baidu.FL.JS_WORD&&(f==="return"||f==="to"))||(d===baidu.FL.JS_START_EXPR||d===baidu.FL.JS_START_BLOCK||d===baidu.FL.JS_END_BLOCK||d===baidu.FL.JS_OPERATOR||d===baidu.FL.JS_EQUALS||d===baidu.FL.JS_SEMICOLON||d===baidu.FL.FL_EOF)){e=this._getRegexpToken(a);if(e){return e}}}if(a==='"'||a==="'"){e=this._getQuoteToken(a);if(e){return e}}if(a==="#"){e=this._getSharpVariblesToken(a);if(e){return e}}if(this._is_match(a,this._punct)){e=this._getPunctToken(a);if(e){return e}}return[a,baidu.FL.FL_NORMAL]};this._getWordToken=function(a){var b,c;while(this._is_match(this.content[this.parsePos],this._wordchar)&&this.parsePos<this.contentLength){a+=this.content[this.parsePos];this.parsePos++}if((this.content[this.parsePos]==="+"||this.content[this.parsePos]==="-")&&/^[0-9]+[Ee]$/.test()&&this.parsePos<this.contentLength){b=this.content[this.parsePos];this.parsePos++;c=this.getNextToken();a+=b.$t[0];return[a,baidu.FL.JS_WORD]}if(a==="in"){return[a,baidu.FL.JS_OPERATOR]}return[a,baidu.FL.JS_WORD]};this._getCommentToken=function(a){var d="";var b=true;var c=this.content[this.parsePos];var e,b;if(c==="*"){this.parsePos++;while(!(this.content[this.parsePos]==="*"&&this.content[this.parsePos+1]&&this.content[this.parsePos+1]==="/")&&this.parsePos<this.contentLength){e=this.content[this.parsePos];d+=e;if(e==="\x0d"||e==="\x0a"){b=false}this.parsePos++}this.parsePos+=2;if(d.indexOf("@cc_on")===0){return["/*"+d+"*/",baidu.FL.JS_IE_CC]}if(b){return["/*"+d+"*/",baidu.FL.JS_INLINE_COMMENT]}else{return["/*"+d+"*/",baidu.FL.JS_BLOCK_COMMENT]}}if(c==="/"){d=a;while(this.content[this.parsePos]!=="\x0d"&&this.content[this.parsePos]!=="\x0a"&&this.parsePos<this.contentLength){d+=this.content[this.parsePos];this.parsePos++}this.parsePos++;return[d,baidu.FL.JS_COMMENT]}};this._getQuoteToken=function(a){var b=a;var d=false;var c=a;while(this.content[this.parsePos]!==b||d){c+=this.content[this.parsePos];d=!d?(this.content[this.parsePos]==="\\"):false;this.parsePos++;if(this.parsePos>=this.contentLength){return[c,baidu.FL.JS_STRING]}}this.parsePos++;c+=b;return[c,baidu.FL.JS_STRING]};this._getRegexpToken=function(a){var b=a;var e=false;var d=a;var c=false;while(e||c||this.content[this.parsePos]!==b){d+=this.content[this.parsePos];if(!e){e=(this.content[this.parsePos]==="\\");if(this.content[this.parsePos]==="["){c=true}else{if(this.content[this.parsePos]==="]"){c=false}}}else{e=false}this.parsePos++;if(this.parsePos>=this.contentLength){return[d,baidu.FL.JS_REGEXP]}}this.parsePos++;d+=b;while(this._is_match(this.content[this.parsePos],this._wordchar)&&this.parsePos<this.contentLength){d+=this.content[this.parsePos];this.parsePos++}return[d,baidu.FL.JS_REGEXP]};this._getSharpVariblesToken=function(a){var c=a;var d,b;if(this._is_match(this.content[this.parsePos],this._digits)){do{d=this.content[this.parsePos];c+=d;this.parsePos++}while(d!=="#"&&d!=="="&&this.parsePos<this.contentLength);b=this.content.substr(this.parsePos,2);if(b==="[]"||b==="{}"){c+=b;this.parsePos+=2}return[c,baidu.FL.JS_WORD]}};this._getPunctToken=function(a){while(this._is_match(a+this.content[this.parsePos],this._punct)&&this.parsePos<this.contentLength){a+=this.content[this.parsePos];this.parsePos++}return[a,a==="="?baidu.FL.JS_EQUALS:baidu.FL.JS_OPERATOR]}};