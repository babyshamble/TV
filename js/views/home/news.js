$(function() {
    // if(typeof(TV)=="undefined") var TV={};
   
    TV.News = function(){

        function createBlcok() {
            $('.news-block').each(function() {
                var blockWidth = 720,
                    blockLeft = $(this).index() * blockWidth + ($(this).index()+1) * 20;

                $(this).css('left', blockLeft + 'px');
            });

            $('.news-block-e2').each(function() {
                var blockHeight = 210,
                    blockTop= ($(this).index()-1) * blockHeight + $(this).index() * 20;
                    
                $(this).css('top', blockTop+ 'px');
            });
        };

        function mainClick() {
            $('.news-block-e').off('click').on('click', function() {
                if ($(this).parent().hasClass('last-news-block')) appendMoreList();

                if ($(this).hasClass('news-main-move-foucs')) {
                    var did = $(this).attr('did');
                    
                    location.hash = '#/' + 'art/' + TV.Configure.runtime.system + '/' + TV.Configure.runtime.pm.a + '/0' + '/0' + '/0' + '/' + did; // 直接从首页点击进入正文
                    return;
                } else {
                    $('.news-main-move-foucs').removeClass('news-main-move-foucs');
                    $(this).addClass('news-main-move-foucs');
                    onMouseEnter($(this));
                    $('.news-block-e').trigger('mouseleave');
           
                    var 
                        distance = 0,
                        index = $(this).index(),
                        parentDistance = $(this).parent().index() * $(this).parent().width(),
                        halfE1 = ($('.news-block-e1').width()) / 2,
                        halfE2 = ($('.news-block-e2').width()) / 2;

                    if (index == 0) {
                        if ($(this).parent().index() == 0) {
                            distance = 0;
                        } else {
                            distance = parentDistance - 10 - halfE2;
                        }
                    } else {
                        if ($(this).parent().index() == 0) {
                            distance = halfE1 + 20;
                        } else {
                            distance = parentDistance + 20 + halfE1;
                        } 
                    }
        
                    $(this).parent().parent().animate({
                        left: -(distance)
                    }, 1000);
                }
            });
        };

        function appendMoreList() {
            $('.last-news-block').removeClass('last-news-block');
            var 
                url = 'html/news-many.html',
                cont = $('#'+TV.Configure.runtime.system+'-more-list');
                
                TV.Helper.loadHtml(cont, url, function() {
                    var html = cont.html(),
                        res = $('#'+TV.Configure.runtime.system+'-main-move-'+TV.Configure.runtime.pm.a);
                        
                        res.append(html);
                        createBlcok();
                        tableCell();
                        mainClick();
                        hoverAnimate();
                        renderImg();
                        TV.Sound.resetPointerReader();
                });
        };

        function menuClick() {
            $('#news-menu .menu-e').off('click').on('click', function() {
                var did = $(this).attr('did'),
                    isdir = $(this).attr('isdir');
                    
                if (isdir == 0) {
                    if (did == TV.Configure.runtime.pm.a) return;
                    $('#'+TV.Configure.runtime.system).addClass('fromMenu');
                    location.hash = '#/' + 'home/' + TV.Configure.runtime.system + '/' + did;
                    return;
                } 
                else if(isdir == 1){
                    $('#'+TV.Configure.runtime.system+'-menu').find('menu-e').removeClass('menu-foucs');
                    $(this).addClass('menu-foucs');
                    location.hash = '#/' + 'list/' + TV.Configure.runtime.system + '/' + did + '/0' ;
                    return;
                }
                
            });
        }; 

        function menuMoveClick() {
            $('#news-right').off('click').on('click', function() {
                if ($('.lastMenuMovePosition').length == 0) {
                    var mf = -($('#news-menu-move .menu-e').eq(0).width()) - 20;

                    $('#news-menu-move .menu-e').eq(0).addClass('lastMenuMovePosition');
                }
                else {
                    var width = $('.lastMenuMovePosition').next().width(),
                        mf = parseInt($('#news-menu-move').css('margin-left')) - width - 20;

                    $('.lastMenuMovePosition').removeClass('lastMenuMovePosition').next().addClass('lastMenuMovePosition');
                }

                $('#news-menu-move').animate({'margin-left': mf});

                if (TV.homeControl.suitableWidth + mf < $('#news-menu').width()) 
                    $('#news-right').removeClass('show');  
        
                if (!$('#news-left').hasClass('show'))
                    $('#news-left').addClass('show');
            });

            $('#news-left').off('click').on('click', function() {  var 
                    width = $('.lastMenuMovePosition').width(),
                    mf = parseInt($('#news-menu-move').css('margin-left')) + width + 20;
            
                $('#news-menu-move').animate({'margin-left': mf});

                $('.lastMenuMovePosition').removeClass('lastMenuMovePosition').prev().addClass('lastMenuMovePosition');
              
                if ($('.lastMenuMovePosition').length == 0) {
                  $('#news-left').removeClass('show');  
                }

                if (!$('#news-right').hasClass('show'))
                    $('#news-right').addClass('show');
            });
        };
        
        var etime;
        function hoverAnimate() {
            $('.news-block-e').off('mouseenter').on('mouseenter', function() {
                if ($(this).hasClass('news-main-move-foucs')) return;
                if (etime) {
                    clearTimeout(etime);
                    etime = undefined;
                }

                var that = $(this);
                etime = setTimeout(function() {
                    onMouseEnter(that);
                }, 600);
            });

            $('.news-block-e').off('mouseleave').on('mouseleave', function() {
                if (etime) {
                    clearTimeout(etime);
                    etime = undefined;
                }

                if ($(this).hasClass('news-main-move-foucs')) return;
                
                var target = $(this);
                if ($(this).find('.news-block-e1-text-cont').length != 0) {
                    $(this).find('.news-block-e1-text-cont').animate({'height': '58px'}, 500, function () {
                        refineTdHeight(target);
                    });
                }
                else {
                    $(this).find('.news-block-e2-text-cont').animate({'height': '28px'}, 500, function() {
                        refineTdHeight(target);
                    });
                }
            });
        };

        function onMouseEnter(target) {
            var text = target.find('.news-block-info').text();  
            target.find('td').text(text).addClass('news-block-table');
            target.children().children().eq(0).animate({'height': '100%'}, 500);
            YX.Read.PointerRead(text);
        };

        function refineTdHeight(target) {
            var text = target.find('.news-block-name').text();
                target.find('td').text(text);
            var str = target.find('td').text().replace(/\s*\r?\n\s*/g, "");
            if (str.length > 14)  target.find('td').removeClass('news-block-table');     
        };

        function tableCell() {
            $('.news-block-e').find('td').each(function() {
                var str = $(this).text().replace(/\s*\r?\n\s*/g, "");
                if (str.length < 14) {
                    $(this).addClass('news-block-table');
                }
            });
        };

        function isFirst() {
            if (TV.Configure.runtime.pm.a) {
                var home = new TV.homeControl();
                home.homeFoucs();
                home.homeMainShow();
            }
            else {
                var did = $('#news-menu .menu-e').eq(0).attr('did');
                location.hash = '#/' + 'home/' + TV.Configure.runtime.system + '/' + did;
            }
        };

        function renderImg(cont) {
            var cont = $('.news-block-e');

            cont.each(function() {
                var imageSrc = $(this).attr('item-image'),
                    that = $(this);

                TV.Helper.loadImg(imageSrc, function(src) {
                    that.css('background-image', 'url(' + src + ')');
                    that.addClass('imgsuccess');
                }, function() {
                    if (that.hasClass('news-block-e1')) {
                        that.css('background-image', 'url(imgs/img-local.jpg)');
                    }
                    else {
                        that.css('background-image', 'url(imgs/img-media.jpg)');
                    }
                    that.addClass('imgfalse');
                });
            });
        };

        renderImg();
        createBlcok();
        menuClick();
        mainClick();
        menuMoveClick();
        tableCell();
        hoverAnimate();
        isFirst();
        TV.Sound.resetPointerReader();
    };

    TV.News();
});


