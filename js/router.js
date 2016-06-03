;
if(typeof(undefined) == typeof(TV)) TV={};

//based on jquery-1.7.2
//for >=ie8 >=chrome5 >=firefox3.6 >=safari5.0 >=opera10.0 
//unresolve:1、参数对应没有完成（如function(cateid,mapid)和function(mapid,cateid)其实cateid、mapid的值是对应位置而不发生改变）
//			2、相同个数参数区分（如'/navigation'和'/error'应当不同，但目前做相同处理，解决方案是路由参数设置为'/:mode'）

//基于onhashchange的路由调度插件
//对于不支持onhashchange的，才去setInterval定期获得hash监控是否改变
/****************************update log***********************************/
////////////1.1.0/////////////
//topic: 增加router回调方式，由原先单纯配置型，增加不定参数类型。
//
TV.Router = function(r){
	var 
		config = {
			strict: true,				//use strict
			on: undefined,				//路由触发回调函数
			notfound: undefined,		//未发现指定路由回调函数
			indefinite: undefined		//不定参数的回调
		}
		router = {},					//路由对象缓存
		isReady = false,				//是否准备完毕
		lastHash = '',					//用于setInterval情况下，记录的上一次hash值
		dispatchType = 0,				//回调方式，0--路由配置, 1--不定参数apply
		indefiniteApply = undefined;	//dispatchType == 1时，回调函数。

	this.configure = function(r, type){		//路由配置
		if(isReady) return;

		isReady = true;

		for(var p in r){
			if(config.hasOwnProperty(p)){
				config[p] = r[p];
			}
		}

		config.strict && 'use strict';

		if(type){
			dispatchType = type;
			if(typeof(config.indefinite) !== 'function'){
				throw 'function must be init when set configures which keyname called indefinite!';
			}
		}

		set();
	};

	this.init = function(h){			//初始化router，开始工作
		if(!h || h=='') return;
		if(h.indexOf('#') < 0) h = '#' + h;
		
		if(location.hash == ''){		//hash为空时，才将初始化路由赋值
			location.hash = h;
		}
		else{							//初始的hash不为空时，不将初始化路由赋值
			changed();	//初始化时，如果location.hash等于init的hash，强制改变
		}
	};

	function compute(r){				//将new TV.Router(routes)传递进来的路由调度分析、缓存
		if(!r) return;

		for(var para in r){
			var pcount = para.split('/').length - 1;
			var current = {};
			current['topic'] = para;
			current['index'] = pcount;
			current['on'] = r[para].on;
			current['after'] = r[para].after;

			router[pcount] = current;
			//1:{
			//	topic: '/xxx/:yyy/zzz',
			//	index: 1,
			//	on: [
			//			function(a,b,c){},
			//			...
			//		],
			//	after: []	
			//}
		}
	};

	compute(r);

	function set(){					//设置监听hash改变
		if(('onhashchange' in window) && ((typeof document.documentMode==='undefined') || document.documentMode==8)){
			window.onhashchange = changed;
		}
		else{
			setInterval(function() {
				var ischanged = is();
				if(ischanged) {
				    changed();
				}
			}, 150);
		}
	};

	function is(){					//判断是否和上一次hash相同
		return this.lastHash != location.hash;
	};

	function changed(){				//这里说明hash发生变化，解析hash并调用对应方法
		var hash = location.hash;
		this.lastHash = hash;
		var values = analysis(hash);
		values = values.slice(1);
		var target = undefined;

		switch(dispatchType){
			case 0:
				if(router.hasOwnProperty(values.length)){
					target = router[values.length];
				}

				if(target){
					var topics = target.topic.split('/');
					topics = topics.slice(1);
					for(var i=0; i<topics.length && i<values.length; i++){
						if(topics[i].indexOf(':') < 0){		//以:开头的作为参数，不以:开头的，直接把原来的作为参数传递过去
							values[i] = topics[i];
						}
					}

					for(var i=0; i<target.on.length; i++){
						target.on[i] && (target.on[i]).apply(this, values);		//调用hash对应的方法，apply将参数数组传递
					}

					config.on && config.on();		//最后执行路由触发的回调函数
				}
				else{
					config.notfound && config.notfound();		//没有发现对应路由
				}	
				break;
			case 1:
				if(config.indefinite){
					config.indefinite.apply(window, values);
				}
				break;
			default:
				break;
		}
	};

	function analysis(hash){
		if(!hash || hash.indexOf('#') < 0) return '';
		hash = hash.substring(1);

		return hash.split('/');
	}
};