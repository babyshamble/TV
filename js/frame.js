if(typeof(undefined) == typeof(TV)) TV={};

//入口
//功能：1、前期配置、数据准备；2、兼容性处理；3、各项初始化；4、路由初始化和调度
//		5、开放API方法集合;
TV.Frame = function(){
	var dispatcher;
	
	function init(){
		dispatcher = new TV.Dispatcher();
		director();	//全部准备好后，初始化路由
		YX.Read.Init();
	};

	init();

	function director(){
		TV.Configure.runtime.router = new TV.Router();

		TV.Configure.runtime.router.configure({
		    strict: false,
		    on: function() {
		    },
		    notfound: function() {
		        
		    },
		    indefinite: function(){	
		    	var args = arguments;
		    	if(dispatcher){
		    		dispatcher.Guidance.apply(undefined, args);
		    	}
		    }
		}, 1);	//指定为indefinite方式回调

		TV.Configure.runtime.router.init('/home/local/');
	};

};

//程序入口启动，即所有的一切，从这里开始。
TV.Frame();