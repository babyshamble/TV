;
if(typeof(undefined) == typeof(TV)) TV={};

(function(){
	if(window.top != window.self){
		//更换数据服务主域名
		var sys = window.top.YX.Frame.GetSystem();
		var baseurl = sys['baseurl'];

		var rep = 'platform-link';

        $("#yx_config a").each(function(){
            if(this.href.indexOf(rep) >= 0){
                this.href = this.href.replace(rep, baseurl);
            }
        });

        //更换sid、lid、tid
        var sid = window.top.YX.Frame.GetPrimarySiteId();
        var pf = window.top.YX.Frame.GetPlatformId();

        $('#yx_sid').text(sid);
        pf.lid = pf.lid ? pf.lid : '';
        pf.tid = pf.tid ? pf.tid : '';

        $('#yx_lid').text(pf.lid);
        $('#yx_tid').text(pf.tid);
	}
})();

//兼容性处理、预加载数据
TV.Ready = {
	init: function(){
		TV.Ready.prepare();
		TV.Ready.compatible();

		if(YX && YX.Read && YX.Read.Init)
			YX.Read.Init();
	},
	prepare: function(){	//前期数据准备
		// (function(){	//准备yx_config配置数据
		// 	var direct = undefined;
		// 	if($('#yx_director').length > 0){
		// 		direct = $('#yx_director').attr('director');
		// 	}

		// 	$('#yx_config a').each(function(){
		// 		if($(this).attr('config') && $(this).attr('config') == '1'){

		// 		}
		// 		else{
		// 			var header = direct ? direct : $(this).attr('director');
		// 			this.href = header + $(this).attr('base');
		// 		}
		// 	});
		// })();
	},
	compatible: function(){
		// (function(){	//兼容Array.isArray在ie8
		// 	if (!Array.isArray) {
		// 	  Array.isArray = function(arg) {
		// 	    return Object.prototype.toString.call(arg) === '[object Array]';
		// 	  };
		// 	}
		// })();

		// (function(){	//兼容Array.prototype.filter在ie8
		// 	if (!Array.prototype.filter) {
		// 	  Array.prototype.filter = function(fun/*, thisArg*/) {
		// 	    'use strict';

		// 	    if (this === void 0 || this === null) {
		// 	      throw new TypeError();
		// 	    }

		// 	    var t = Object(this);
		// 	    var len = t.length >>> 0;
		// 	    if (typeof fun !== 'function') {
		// 	      throw new TypeError();
		// 	    }

		// 	    var res = [];
		// 	    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		// 	    for (var i = 0; i < len; i++) {
		// 	      if (i in t) {
		// 	        var val = t[i];

		// 	        if (fun.call(thisArg, val, i, t)) {
		// 	          res.push(val);
		// 	        }
		// 	      }
		// 	    }

		// 	    return res;
		// 	  };
		// 	}
		// })();
	}
};

TV.Configure = {
	runtime: {
		router: undefined,
		webkind: 'navigation',
		system: 'unit',	
		firstEnter: undefined,
		pm: {	//参数列表
			a: -1,
			b:-1,
			c:-1,
			d:-1,
			e:-1,
			f:-1
		},
		baseurl: '',
		basename: '',
		navigationDomReady: false,
		columnDomReady: false,
		listDomReady: false,
		artDomReady: false,
		introductionDomReady: false,
		setDomReady: false,
		lastRenderWebkind: undefined,
		settingReader: false
	},
	setting: {
		vol: 5,
		speed: 0,
		volSwitch: true
	},
	init: function(){
		var base = {
			'url': $('#yx_base').attr('baseurl'),
			'name': $('#yx_base').attr('basename')
		};

		this.runtime.baseurl = base.url;
		this.runtime.basename = base.name;
	},
	filterImages: function(url){
		var imgs = [];
		var imgIndex = 'xxx/index.php?apim2';

		if(url && url.length > 0){
			var cache = url.split('||');
			for(var i=0; i<cache.length; i++){
				var img = cache[i];
				var e = img.split('/^');
				if(e && e.length >= 3){
					imgs.push(e[0]);
				}
			}
		}

		return imgs;
	}
};