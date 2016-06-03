if(typeof(undefined) == typeof(TV)) TV = {};
var FUNCTION = typeof function(){};

TV.Helper ={ 
	object2Array: function(obj){
		var arr = [];
		switch(TV.Helper.checkTargetProperty(obj)){ 
			case 'object':
				for(var o in obj){ 
					arr.push(obj[o]);
				}
				break;
			case 'array':
				arr.concat(obj);
				break;
		}

		return arr;
	},

	array2Object: function(arr){ 
		var tempIndex = 0;
		var obj = undefined;
		switch(TV.Helper.checkTargetProperty(arr)){
			case 'object':
				obj = arr;
				break;
			case 'array':
				for(var i=0; i<arr.length; i++){
					if(arr[i].hasOwnProperty('id')) tempIndex = arr[i]['id'];
					else tempIndex = (new Date()).getTime();

					obj[tempIndex] = arr[i];
				}
				break;
		}

		return obj;
	},

	checkTargetProperty: function(tar){ 
		var type = undefined;
		switch(Object.prototype.toString.call(tar)){ 
			case '[object Object]':
				type = 'object';
				break;
			case '[object Array]':
				type = 'array';
				break;
			default:
				type = typeof(tar);
				break;
		}

		return type;
	},

	computeObjectLength: function(tar){
		var len = 0;
		switch(TV.Helper.checkTargetProperty(tar)){ 
			case 'object':
				for(var i in tar){ 
					len++;
				}
				break;
			case 'array':
				len = tar.length;
				break;
		}

		return len;
	},

	setCookie: function(key, value, effectiveTimes, p){
		var eff = effectiveTimes ? (new Date()).getDate()+effectiveTimes : 0;
		if(TV.Helper.checkCookie(key)) eraseCookie(key);
		document.cookie = key + '=' + escape(value) + (effectiveTimes ? (';espires=' + eff.toGMTString()) : '');
	},

	checkCookie: function(key){
		return TV.Helper.getCookie(key) != '';
	},

	getCookie: function(key){
		var cook = '';

		if(document.cookie.length > 0){
			var start = document.cookie.indexOf(key);
			if(start >= 0){
				start = start + key.length + 1;
				var end = document.cookie.indexOf(';', start);
				end = end == -1 ? end = document.cookie.length : end;
				cook = unescape(document.cookie.substring(start, end));
			}
		}

		return cook;
	},

	eraseCookie: function(key, path){
		if(TV.Helper.checkCookie(key)){
			var exp = new Date();
			exp.setTime(exp.getDate() - 100);
			document.cookie = key + '=' + TV.Helper.getCookie(key) + ';espires=' + exp.toGMTString();
		}
	},

	loadImg: function(src, success, fail){
        var img;

        img = new Image();
     
        if (FUNCTION === typeof success) {
	        img.onload = function() {
	            success.call(img, src);
	        }
    	}

	    if (FUNCTION === typeof fail) {
	        img.onerror = function() {
	            fail.call(img, src);
	        }
	    }

        img.src = src;
    },

    loadHtml: function(cont, url, fun){
        cont.load(url, function() {
        	if (fun) fun();
        });
    }
};

TV.Sound = {
	init: function(){

	},
	prpointer: undefined,
	resetPointerReader: function(){	
		$('.pointer_reader').off('mouseenter').on('mouseenter', function(ev){
			YX.Read.UnContinueRead();
	        YX.Read.Stop();
	        
			if(TV.Sound.prpointer){
				clearTimeout(TV.Sound.prpointer);
				YX.Read.UnPointerRead();
				TV.Sound.prpointer = undefined;
			}

			var tx = $(this).text();
	
			TV.Sound.prpointer = setTimeout(function(){
				YX.Read.PointerRead(tx);//播报指定内容，
			}, 200);
			
		}).off('mouseleave').on('mouseleave', function(ev){	
			if(TV.Sound.prpointer){
				clearTimeout(TV.Sound.prpointer);
				TV.Sound.prpointer = undefined;
			}

			if(YX && YX.Read){
				YX.Read.UnPointerRead();
			}	
		});
	},
	setter: undefined,
	settingReader: function() {
		clearTimeout(TV.Sound.setter);
		clearTimeout(TV.Sound.prpointer);
		clearTimeout(TV.Sound.clicker);
		// YX.Read.UnPointerRead();
		// YX.Read.UnContinueRead();
		YX.Read.Stop();
		TV.Sound.setter = undefined;
		var tx = '上下切换栏目左右切换列表';

		TV.Sound.setter = setTimeout(function(){
			YX.Read.PointerRead(tx); // 播报指定内容，
		}, 100);
	},
	clicker: undefined,
	clickReader: function(tx) {
		clearTimeout(TV.Sound.setter);
		clearTimeout(TV.Sound.prpointer);
		clearTimeout(TV.Sound.clicker);
		// YX.Read.UnPointerRead();
		// YX.Read.UnContinueRead();
		YX.Read.Stop();

		clicker = setTimeout(function(){
			YX.Read.PointerRead(tx); // 播报指定内容，
		}, 100);
	}
};