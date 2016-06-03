// if(typeof(TV)=="undefined") var TV={};

$(function() {

	TV.Art = function(){
		var art = this;

		var
	 		runtimeData,
	 		refineArtData;
	
	 	art.init = function(data){
	 		refineArtData = TV.Chapter.init(data);
	 		artBar(refineArtData);
			renderMain(refineArtData);
			artPause();
			chapterChange();
			artClose();
	 	};

	 	art.denit = function(){
	 		$('#base').html('');
	 		runtimeData;
	 		refineArtData;
	 		art.Component.Stop();
	 		chapterID = 0;
	 	};

	 	// 正文处理方法
	 	art.Component = {};
	/*
	************************整体渲染***********************
	*/
	 	function renderMain(artBar) { // 段落切换控制器
			// 单个段落阅读结束样式清空
			if (chapterID > refineArtData.length - 1) {
				// 整篇文章阅读结束
				chapterID = 0;
				return;
			} else {
				chapterFinish(artBar);
			}

			if (refineArtData[chapterID].type == 'img') {
				chapters = refineArtData[chapterID];
				renderIMG();
			}

			if (refineArtData[chapterID].type == 'imgs') {
				chapters = refineArtData[chapterID];
				renderIMGS();
			}

			if (refineArtData[chapterID].type == 'text') {
				chapters = TV.Helper.object2Array(refineArtData[chapterID].data);
				renderText();
			}
		};

		function renderText() {
			$('#art-body-on-cont').html(chapters[screenID].html);
			$('#art-info-cont').html($('#art-name').text());

			$('#art-body').fadeIn(1000, function() {
				var margintop = $('#art-body-on-cont').height() / 2;

				$('#art-body-on-cont').css('margin-top', '-' + margintop + 'px');

 				$('#art-body-on-cont').fadeIn(1000, function() {
 					if (art.Component.Pause.Mask) return;
					art.Component.Start('text');
				});
			});
		};

		function renderIMG() {
			var back = '<div class="art-img" item-image="'+fatchImgsSrc(chapters.img)+'"></div>';

			$('#art-img').html(back);
		
			$('#art-body').fadeOut(1000, function() {
				$('#art-body-on-cont').fadeOut(1000, function() {
					renderImg($('.art-img'));
					chapters = chapters.data;
					if (chapters) {
						$('#art-info-cont').html(chapters[sentenceID]);
						art.Component.Start('img');
					}
				});
			});
		};

		function renderIMGS() {
			var imgs = fatchImgsSrc(chapters.img),
				itemWidth = $('#base').width() * 8/10,
				contWidth = itemWidth * imgs.length;
				
			var cont = '<div id="carousel-left" class="carousel-bar carousel-hover"></div><ul id="carousel-cont" style="width:'+contWidth+'px" class="carousel-hover carousel-hover"></ul><div id="carousel-right" class="carousel-bar">';
			$('#art-img').html(cont);

			for (var i=0; i<imgs.length; i++) {
				var html = '<li class="carousel-e" style="width:'+itemWidth+'px" item-image="'+imgs[i]+'"></li>';

				$('#carousel-cont').append(html);
			}
			
			renderImg($('.carousel-e'));
			carouselInit();
			imgsCarousel();
			imgsCarouselClick();

			chapters = chapters.data;
			$('#art-info-cont').html(chapters[sentenceID]);
			art.Component.Start('img');
		};

		function chapterFinish(artBar) {// 段落样式初始化
			if(!artBar) art.Component.Stop();
			$('#art-img').html('');
			artTextRefine();
			$('#art-body').hide();
			$('#art-body-on-cont').hide();
		};

	/*
	********************阅读部分************************
	**阅读部分有两种处理方式
	**1.纯文字阅读
	**2.含图片的段落阅读
	*/	
		var
			YRAPI = YX.Read,
			chapterID = 0,
			screenID = 0,
			sentenceID = 0,
			chapters = [],
		    artcomplete = false,
		    artpointer = undefined;

		art.Component.Start = function(type) {
			YRAPI.Stop();
			if (type == 'text') readArticleFromChapter();
			if (type == 'img')	readIMGFromChapter();
		};

		art.Component.Pause = function(type) {
			if (artpointer) {
	    		clearTimeout(artpointer);
	    		artpointer = undefined;
	    	}

		    artcomplete = false;

	        YRAPI.UnContinueRead();
	        YRAPI.Stop();
		};

		art.Component.Pause.Mask = false;

		art.Component.Replay = function(type) {
			if(refineArtData[chapterID].type == 'text') {
				readArticleFromChapter();
			}
			else {
				readIMGFromChapter();
			}
		};

		art.Component.Stop = function() {
	    	if (artpointer) {
	    		clearTimeout(artpointer);
	    		artpointer = undefined;
	    	}

		    screenID = 0;
		    sentenceID = 0;
		    artcomplete = false;

	        YRAPI.UnContinueRead();
	        YRAPI.Stop();
	    };

	    function artPause() {
	    	$('#art-pause').off('click').on('click', function() {
	    		art.Component.Pause();
	    		var mask = $('#art-pause').hasClass('art-pause-foucs');
	
	    		if (mask) {
	    			// 重启
	    			$(this).removeClass('art-pause-foucs');	
	    			YX.Read.PointerRead('播放');
	    			art.Component.Pause.Mask = false;
	    			setTimeout(function() {
	    				art.Component.Replay();	
	    			}, 3000);
	    		} else {
	    			// 暂停
	    			$(this).addClass('art-pause-foucs');
	    			YX.Read.PointerRead('暂停');	
	    			art.Component.Pause.Mask = true;
	    			$('#art-info-cont').pause();
	    		}
	    	});
	    };

	    function chapterChange() {
	    	$('.art-bar-line-e').off('click').on('click', function() {
	    		art.Component.Stop();
	    		var mask = $(this).attr('mask');
	    		chapterID = mask.split('-')[0];
	    		screenID = mask.split('-')[1];
	    		renderMain(true);
	    		$('.art-bar-line-e').removeClass('art-bar-line-e-finish lastFinish');
	    		$('.art-bar-line-dot').removeClass('art-bar-line-dot-foucs');

	    		$(this).prevAll().addClass('art-bar-line-e-finish');
	    		$(this).prev().addClass('lastFinish').find('.art-bar-line-dot').addClass('art-bar-line-dot-foucs');
	    	});
	    };

	/***
	*******************纯文字阅读******************
	***/

		function readArticleFromChapter() {
			if (!chapters[screenID].data) return;
			
			var
		      	currentChapter = chapters[screenID].data[sentenceID],
	      		nextChapter = chapters[screenID].data[sentenceID+1];

	    	console.log(currentChapter);
	    	console.log(nextChapter);

	       	currentSentenceFoucs(currentChapter);

	 		YRAPI.ContinueRead(currentChapter, nextChapter, null, SetCurrentReadingIndex,true, null);

	 		if (nextChapter) {
	 			var sp = currentChapter.length > 20 ? (currentChapter.length / 2 * 1000) : currentChapter.length;
	 			sp = sp <= 5 ? 5 : sp;
	 			startFix(sp*1000);
	 		} else {
	 			if (artpointer) {
	 				clearTimeout(artpointer);
	 				artpointer = undefined;
	 			}
	 			artcomplete = true;
	 		}
	    };

	    function SetCurrentReadingIndex() {
	    	if (artpointer) {
	    		clearTimeout(artpointer);
	    		artpointer = undefined;
	    	}

	    	sentenceID++;

	    	if (sentenceID > chapters[screenID].data.length - 1) {
	    		screenID++;
	    		screenFinish();

	    		if (screenID > chapters.length - 1) {
	    			chapterID++;
					renderMain();
	    		}
	    		else {
	    			sentenceID = 0;
	    			$('#art-body-on-cont').fadeOut(1000, function() {
	    				renderText();
	    			});
	    		}
	    	}
	    	else {
	        	readArticleFromChapter();
	    	}
	    };

	/**
	*********************含图片的文字阅读*******************
	***/

	    function readIMGFromChapter() {
	    	var
		      	currentChapter = chapters[sentenceID],
	      		nextChapter = chapters[sentenceID+1];

	    	console.log(currentChapter);
	    	console.log(nextChapter);

	 		YRAPI.ContinueRead(currentChapter, nextChapter, artTextRolling, SetCurrentIMGIndex,true, null);

	 		if (nextChapter) {
	 			var sp = currentChapter.length > 20 ? (currentChapter.length / 2 * 1000) : currentChapter.length;
	 			sp = sp <= 5 ? 5 : sp;
	 			startFix(sp*1000);
	 		} else {
	 			if (artpointer) {
	 				clearTimeout(artpointer);
	 				artpointer = undefined;
	 			}
	 			artcomplete = true;
	 		}
	    };

	    function SetCurrentIMGIndex() {
	    	if (artpointer) {
	    		clearTimeout(artpointer);
	    		artpointer = undefined;
	    	}

	    	sentenceID++;
	    	screenFinish();

	    	if (sentenceID > chapters.length - 1) {
	    		chapterID++;
				renderMain();
	    	}
	    	else {
	    		$('#art-info-cont').html(chapters[sentenceID]);
	        	readIMGFromChapter();
	    	}
	    };

	/***
	*******************阅读时的样式调整*****************
	***/

		function startFix(sp) {
			artpointer = setTimeout(function() {
				SetCurrentReadingIndex();
			}, sp);
		};

		function currentSentenceFoucs (data) {
			$('.art-main-span').removeClass('art-sentence-foucs');
				$('.art-main-span').eq(sentenceID).addClass('art-sentence-foucs');
		};

		function artTextRolling() {
			artTextRefine();

		    var offset = $('#art-info-cont').width(),
		    	time = ($('#art-info-cont').text().length) * 300;

		    $("#art-info-cont").animate({left: '-' + offset}, time);
	    };

	    function artTextRefine() {
	    	$("#art-info-cont").stop();
	    	$("#art-info-cont").css('left', '2%');
	    };

	/****************end 阅读部分 end****************/

	/*
	*************************多图片轮播*************************
	*/

	var 
			animateMask = false,
			carouselIndex = 1,
			c, l, r, clickTime;

		function imgsCarousel() {
			if (c) clearInterval(c);

			c = setInterval(function() {
				var 
					mf = parseInt($('#carousel-cont').css('margin-left')),
					maxmf = $('#carousel-cont').width() - $('#art-img').width(),
					offsetLeft =  carouselIndex * $('#art-img').width();
					animateMask = true;
				
				if (-(mf) < maxmf) {
					$('#carousel-cont').animate({'margin-left': '-' +offsetLeft + 'px'}, 800, function() {
						carouselIndex++;
						animateMask = false;
						// console.log(carouselIndex);
					});
				}
				else {
					$('#carousel-cont').animate({'margin-left': 0}, 800, function() {
						carouselIndex = 1;
						animateMask = false;
						// console.log(carouselIndex);
					});
				}		
			}, 4000);
		};

		function imgsCarouselClick() {
			$('#carousel-left').off('click').on('click', function() {
				if (clickTime || animateMask) clearTimeout(clickTime);
				
				clickTime = setTimeout(function() {
					carouselStart();
					// console.log('left');

					var 
						mf = parseInt($('#carousel-cont').css('margin-left')),
						mfMask = $('#art-img').width(),
						offset = mf + mfMask + 'px';
						animateMask = true;
					
					if (mf >= 0) {
						$('#carousel-cont').css('margin-left', 0);
						carouselFinish('left');

					} else {
						l = $('#carousel-cont').animate({'margin-left': offset}, 800, function() {
							carouselFinish('left');
						});
					}
				}, 1000);

			});

			$('#carousel-right').off('click').on('click', function() {
				if (clickTime || animateMask) clearTimeout(clickTime);
				
				clickTime = setTimeout(function(){
					carouselStart();		
					var 
						mf = parseInt($('#carousel-cont').css('margin-left')),
						mfMask = $('#art-img').width(),
						offset = mf - mfMask + 'px',
						maxLeft = $('#carousel-cont').width() - mfMask;
						animateMask = true;
			
					if (-(mf) >= maxLeft) {
						$('#carousel-cont').css('margin-left', -(maxLeft)+'px');
						carouselFinish('right');
					} else {
						r = $('#carousel-cont').animate({'margin-left': offset}, 800, function() {
							carouselFinish('right');
						});
					}
				}, 1000);
			});

			$('.carousel-hover').unbind('mouseenter').bind('mouseenter', function(ev){
				carouselStart();
				clearTimeout(clickTime);
			}).unbind('mouseleave').bind('mouseleave', function(ev){
				imgsCarousel();
			});
		};

		function carouselInit() {
			clearInterval(c);
			clearInterval(l);
			clearInterval(r);
			animateMask = false;
			carouselIndex = 1;
		};

		function carouselStart() {
			clearInterval(c);
			clearInterval(l);
			clearInterval(r);
		};

		function carouselFinish(type) {
			if (type == 'left') {
				carouselIndex--;
				if (carouselIndex <= 1) carouselIndex = 1;
				// console.log(carouselIndex);
				imgsCarousel();
				animateMask = false;
			}
			else if (type == 'right') {
				carouselIndex++;
				if (carouselIndex >= $("#carousel-cont > li").length) carouselIndex = $("#carousel-cont > li").length;
				imgsCarousel();
				animateMask = false;
			}
		};

	/*
	****************************辅助方法***************************
	###加载并渲染图片
	###调整行高
	###图片路径提取
	*/
		function renderImg(cont) {
	    	cont.each(function() {
				var imageSrc = $(this).attr('item-image'),
					that = $(this);

				TV.Helper.loadImg(imageSrc, function(src) {
		            that.css('background-image', 'url(' + src + ')');
		            that.addClass('imgsuccess');
		        }, function() {
		        	that.css('background-image', 'url(imgs/default.jpg)');
		            that.addClass('imgfalse');
		        });
			});
		};

		function fatchImgsSrc(data) {
			var imgs = [];

			for (var i=0; i<data.length; i++) {
					var div = document.createElement('div');
		            div.innerHTML = data[i];
		        	var src = div.childNodes[0].src;
		        	imgs.push(src);
				}

				return imgs;
			};
		};

		function artClose() {
	        $('#art-close').off('click').on('click', function() {
	    		$('#art').fadeOut(1000, function() {
	    			if (TV.Configure.runtime.pm.c == 0 &&
		            TV.Configure.runtime.pm.b == 0 &&
		            TV.Configure.runtime.pm.d == 0) {
	    				location.hash = '#/' + 'home/' 
	                              + TV.Configure.runtime.system 
	                              + '/' + TV.Configure.runtime.pm.a;
	                	return;
		            } 
		        	else {
		        		location.hash = '#/' + 'list/' 
	                              + TV.Configure.runtime.system 
	                              + '/' + TV.Configure.runtime.pm.a
	                              + '/' + TV.Configure.runtime.pm.b
	                              + '/' + TV.Configure.runtime.pm.c
	                              + '/' + TV.Configure.runtime.pm.d;
	                	return;
	    			}
	                
	                art.Component.Stop();
	        	});
	        });
	    };

  	/*
	****************************进度条***************************
	### 绘制进度条
	### 一屏读完点亮进度条
	###	进度条Hover
	*/

	  	function artBar(data) {
			for (var i=0; i<data.length; i++) {
				for (var j=0; j<data[i].proportion.length; j++) {
					var html =  '<div class="art-bar-line-e" style=width:'+data[i].proportion[j]+'% mask="'+i+'-'+j+'">'
						 	 +  	'<div class="art-bar-line-dot">'
						 	 +  		'<div class="art-bar-line-info-cover art-bar-line-info-e"></div>'
						 	 +  		'<div class="art-bar-line-info art-bar-line-info-e">'
						 	 +               $('#art-name').text()
						 	 +          '</div>'
						 	 +			'<em class="art-bar-line-info-e"></em>'
						 	 +  	'</div>'
	        			 	 +	'</div>';
	        		$('#art-bar-line').append(html);
				}
			}

			// $('.art-bar-line-dot').eq($('.art-bar-line-dot').length - 1).addClass('disvisible');
		};

		// 一段读完 点亮进度条
		function screenFinish() {
			if (!$('.art-bar-line-e').hasClass('lastFinish')) {
				$('.art-bar-line-e').eq(0).addClass('art-bar-line-e-finish lastFinish').find('.art-bar-line-dot').addClass('art-bar-line-dot-foucs');
			}
			else {
				$('.art-bar-line-e').each(function() {
					if ($(this).hasClass('lastFinish')) {
						if ($(this).index() == $('.art-bar-line-e').length) return;
				
						$(this).removeClass('lastFinish').find('.art-bar-line-dot').removeClass('art-bar-line-dot-foucs');
						
						var taget = $(this).next();
						taget.addClass('art-bar-line-e-finish lastFinish').find('.art-bar-line-dot').addClass('art-bar-line-dot-foucs');
						
						return false;
					}
				});
			}
		};

		function artBarHover() {
			$('.art-bar-line-e').off('mouseenter').on('mouseenter', function() {
				$(this).find('.art-bar-line-info-e').show();
				$('.art-bar-line-dot').addClass('show');
			});

			$('.art-bar-line-e').off('mouseleave').on('mouseleave', function() {
				$(this).find('.art-bar-line-info-e').hide();
				$('.art-bar-line-dot').removeClass('show');
			});
		};

		function createBarLabel() {
	  		$('.art-bar-line-dot').each(function() {
				var width = $(this).find('.art-bar-line-info').width();
				$(this).find('.art-bar-line-info ').css('margin-left', -(width / 2) + 'px');
				
				$(this).find('.art-bar-line-info-cover').css({
					'margin-left': -(width / 2) + 'px',
					'width': width
				});
			});
	  	};

  	var art = new TV.Art(),
		text = $('#art-body-on-cont').html();
		art.init(text);
		$('#art').fadeIn(500, function() {
			createBarLabel();
			artBarHover();
		});

	TV.Sound.resetPointerReader(); 

});