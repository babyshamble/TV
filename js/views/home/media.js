$(function() {
    // if(typeof(TV)=="undefined") var TV={};
   
    TV.Media = function(){
        
        function createBlcok() {
            $('.media-block').each(function() {
                var blockWidth = 720,
                    blockLeft = $(this).index() * blockWidth + ($(this).index()+1) * 20;

                $(this).css('left', blockLeft + 'px');
            });

            $('.media-block-e2').each(function() {
                var blockHeight = 210,
                    blockTop= ($(this).index()-1) * blockHeight + $(this).index() * 20;
                    
                $(this).css('top', blockTop+ 'px');
            });
        };

        function mainClick() {
            $('.media-block-e').off('click').on('click', function() {
                if ($(this).parent().hasClass('last-media-block')) appendMoreList();

                if ($(this).hasClass('media-main-move-foucs')) {
                    var did = $(this).attr('did');
            
                    location.hash = '#/' + 'art/' + TV.Configure.runtime.system + '/' + TV.Configure.runtime.pm.a + '/0' + '/0' + '/0' + '/' + did; // 直接从首页点击进入正文
                    return;
                } else {
                    $('.media-main-move-foucs').removeClass('media-main-move-foucs');
                    $(this).addClass('media-main-move-foucs');
                    onMouseEnter($(this));
                    $('.media-block-e').trigger('mouseleave');
                    
                    var 
                        distance = 0,
                        index = $(this).index(),
                        parentDistance = $(this).parent().index() * $(this).parent().width(),
                        halfE1 = ($('.media-block-e1').width()) / 2,
                        halfE2 = ($('.media-block-e2').width()) / 2;

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
            $('.last-media-block').removeClass('last-media-block');
            var 
                url = 'html/media-many.html',
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
            $('#media-menu .menu-e').off('click').on('click', function() {
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
            $('#media-right').off('click').on('click', function() {
                if ($('.lastMenuMovePosition').length == 0) {
                    var mf = -($('#media-menu-move .menu-e').eq(0).width()) - 20;

                    $('#media-menu-move .menu-e').eq(0).addClass('lastMenuMovePosition');
                }
                else {
                    var width = $('.lastMenuMovePosition').next().width(),
                        mf = parseInt($('#media-menu-move').css('margin-left')) - width - 20;

                    $('.lastMenuMovePosition').removeClass('lastMenuMovePosition').next().addClass('lastMenuMovePosition');
                }

                $('#media-menu-move').animate({'margin-left': mf});

                if (TV.homeControl.suitableWidth + mf < $('#media-menu').width())  
                        $('#media-right').removeClass('show');  
        
                if (!$('#media-left').hasClass('show'))
                    $('#media-left').addClass('show');
            });

            $('#media-left').off('click').on('click', function() {  var 
                    width = $('.lastMenuMovePosition').width(),
                    mf = parseInt($('#media-menu-move').css('margin-left')) + width + 20;
            
                $('#media-menu-move').animate({'margin-left': mf});

                $('.lastMenuMovePosition').removeClass('lastMenuMovePosition').prev().addClass('lastMenuMovePosition');
              
                if ($('.lastMenuMovePosition').length == 0) {
                  $('#media-left').removeClass('show');  
                }

                if (!$('#media-right').hasClass('show'))
                    $('#media-right').addClass('show');
            });
        };

        var etime;
        function hoverAnimate() {
            $('.media-block-e').off('mouseenter').on('mouseenter', function() {
                if ($(this).hasClass('media-main-move-foucs')) return;
                if (etime) {
                    clearTimeout(etime);
                    etime = undefined;
                }

                var that = $(this);
                etime = setTimeout(function() {
                    onMouseEnter(that);
                }, 600);
            });

            $('.media-block-e').off('mouseleave').on('mouseleave', function() {
                if (etime) {
                    clearTimeout(etime);
                    etime = undefined;
                }

                if ($(this).hasClass('media-main-move-foucs'))
                    return; 
                
                var target = $(this);
                if ($(this).find('.media-block-e1-text-cont').length != 0) {
                    $(this).find('.media-block-e1-text-cont').animate({'height': '58px'}, 500, function () {
                        refineTdHeight(target);
                    });
                }
                else {
                    $(this).find('.media-block-e2-text-cont').animate({'height': '28px'}, 500, function() {
                        refineTdHeight(target);
                    });
                }
            });
        };

        function onMouseEnter(target) {
            var text = target.find('.media-block-info').text();  
            target.find('td').text(text).addClass('media-block-table');
            target.children().children().eq(0).animate({'height': '100%'}, 500);
            YX.Read.PointerRead(text);
        };

        function tableCell() {
            $('.media-block-e').find('td').each(function() {
                var str = $(this).text().replace(/\s*\r?\n\s*/g, "");
                if (str.length < 14) {
                    $(this).addClass('media-block-table');
                }
            });
        };

        function refineTdHeight(target) {
            var text = target.find('.media-block-name').text();
                target.find('td').text(text);
            var str = target.find('td').text().replace(/\s*\r?\n\s*/g, "");
            if (str.length > 14)  target.find('td').removeClass('media-block-table');     
        };

        function isFirst() {
            if (TV.Configure.runtime.pm.a) {
                var home = new TV.homeControl();
                home.homeFoucs();
                home.homeMainShow();
            }
            else {
                var did = $('#media-menu .menu-e').eq(0).attr('did');
                location.hash = '#/' + 'home/' + TV.Configure.runtime.system + '/' + did;
            }
        };

        function renderImg(cont) {
            var cont = $('.media-block-e').not('.imgsuccess');

            cont.each(function() {
                var imageSrc = $(this).attr('item-image'),
                    that = $(this);

                TV.Helper.loadImg(imageSrc, function(src) {
                    that.css('background-image', 'url(' + src + ')');
                    that.addClass('imgsuccess');
                }, function() {
                    if (that.hasClass('media-block-e1')) {
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

    TV.Media();
});


