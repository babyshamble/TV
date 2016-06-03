;
if(typeof(undefined) == typeof(TV)) TV = {};

/*
 *	@theme: smartnet_movie controller
 *	@base on: CNIIL Web Framework Core & jquery 1.7.2
 *	@protocol: 
 *		  1.nothing but router dispatch function must be existed;
 *	@power:
 *		  1.dispatch router parameters;
 *		  2.keyboard events dispatcher;
 *	@powered by: luckqin/frez02@126.com
 *	@version: 1.0.0.1
 */
TV.Dispatcher = function(){
		var 
			home, art, list;

		function init(){
			home = new TV.homeControl();
			list = new TV.listControl();
			art = new TV.artControl();
		};

		init();

		this.Guidance = function(){
			if(TV.Dispatcher == this){
				throw "dispatcher function called Guidance can be used for apply only!";
				return;
			}

			var args = arguments;
			if(args.length <= 0){
				throw "arguments error caused by router what arguments length <= 0!";
				return;
			}
		
			TV.Configure.runtime.webkind = args[0];
			TV.Configure.runtime.system = args[1]; // 本地 政信通
			TV.Configure.runtime.pm.a = args[2];
			TV.Configure.runtime.pm.b = args[3]; // 本地二级
			TV.Configure.runtime.pm.c = args[4]; // list
			TV.Configure.runtime.pm.d = args[5]; // art

			switch(args[0]){
				case 'art':
					art.show(args);
				case 'list':
					list.show(args);
				case 'home':
					home.show(args);
					break;
				case 'error':
				default:
					break;
			}	
	};
};