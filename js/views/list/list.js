$(function() {
    // if(typeof(TV)=="undefined") var TV={};

    TV.List = function(){
        var list = new TV.listControl();

        function createBlcok() {
            $('.list-block').each(function() {
                var blockWidth = 720,
                    blockLeft = $(this).index() * blockWidth + ($(this).index()+1) * 20;

                $(this).css('left', blockLeft + 'px');
            });

            $('.list-block-e2').each(function() {
                var blockHeight = 210,
                    blockTop= ($(this).index()-1) * blockHeight + $(this).index() * 20;
                    
                $(this).css('top', blockTop+ 'px');
            });
        };

        function mainClick() {
            $('.list-block-e').off('click').on('click', function() {
                if ($(this).parent().hasClass('last-list-block')) appendMoreList();

                if ($(this).hasClass('list-main-move-foucs')) {
                    var did = $(this).attr('did');

                    location.hash = '#/' + 'art/' 
                                  + TV.Configure.runtime.system 
                                  + '/' + TV.Configure.runtime.pm.a
                                  + '/' + TV.Configure.runtime.pm.b
                                  + '/' + TV.Configure.runtime.pm.c
                                  + '/' + TV.Configure.runtime.pm.d
                                  + '/'+ did;
                    return;
                } else {
                    $('.list-main-move-foucs').removeClass('list-main-move-foucs');
                    $(this).addClass('list-main-move-foucs');
                    onMouseEnter($(this));
                    $('.list-block-e').trigger('mouseleave');
                    
                    var 
                        distance = 0,
                        index = $(this).index(),
                        parentDistance = $(this).parent().index() * $(this).parent().width(),
                        halfE1 = ($('.list-block-e1').width()) / 2,
                        halfE2 = ($('.list-block-e2').width()) / 2;

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
            $('.last-list-block').removeClass('last-list-block');
            var 
                url = 'html/list-many.html',
                cont = $('#'+TV.Configure.runtime.webkind+'-more-list');
   
                TV.Helper.loadHtml(cont, url, function() {
                    var html = cont.html(),
                        res = $('#'+TV.Configure.runtime.webkind+'-main-move-'+TV.Configure.runtime.pm.d);
                        
                        res.append(html);
                        createBlcok();
                        tableCell();
                        mainClick();
                        hoverAnimate();
                        renderImg();
                        TV.Sound.resetPointerReader();
                });
        };

        function columnClcik() {
            $('.list-column-e').off('click').on('click', function() {
                var did = $(this).attr('did');
                if (did == TV.Configure.runtime.pm.c) return;
                
                $('#'+TV.Configure.runtime.webkind).addClass('fromMenu');
                location.hash = '#/' + 'list/' 
                              + TV.Configure.runtime.system + '/' 
                              + TV.Configure.runtime.pm.a + '/' 
                              + TV.Configure.runtime.pm.b + '/' 
                              + did;
                return;
            });
        };

        function menuClick() {
            $('#list-menu .menu-e').off('click').on('click', function() {
                var did = $(this).attr('did');
                if (did == TV.Configure.runtime.pm.c) return;
                
                $('#'+TV.Configure.runtime.webkind).addClass('fromMenu');
                location.hash = '#/' + 'list/' 
                              + TV.Configure.runtime.system + '/' 
                              + TV.Configure.runtime.pm.a + '/' 
                              + TV.Configure.runtime.pm.b + '/'
                              + TV.Configure.runtime.pm.c + '/'
                              + did;
                return;
            });
        };

        function backClick() {
            $('#list-back').off('click').on('click', function() {
                list.hide();
                if (TV.Configure.runtime.pm.b == 0) {
                    var did = $('#'+TV.Configure.runtime.system+'-menu-move').children().eq(0).attr('did');
                    
                    $('.'+TV.Configure.runtime.system+'-main-move').removeClass('home-main-foucs').css('display', 'none');
                    $('#'+TV.Configure.runtime.system+'-main-move-'+did).addClass('home-main-foucs').css('display', 'block');
         
                    location.hash = '#/' + 'home/' + TV.Configure.runtime.system + '/' + did;
                } else {
                    location.hash = '#/' + 'home/' 
                              + TV.Configure.runtime.system 
                              + '/' + TV.Configure.runtime.pm.a;
                }
                return;
            });
        };

        function menuMoveClick() {
            $('#list-right').off('click').on('click', function() {
                if ($('.lastMenuMovePosition').length == 0) {
                    var mf = -($('#list-menu-move .menu-e').eq(0).width()) - 20;

                    $('#list-menu-move .menu-e').eq(0).addClass('lastMenuMovePosition');
                }
                else {
                    var width = $('.lastMenuMovePosition').next().width(),
                        mf = parseInt($('#list-menu-move').css('margin-left')) - width - 20;

                    $('.lastMenuMovePosition').removeClass('lastMenuMovePosition').next().addClass('lastMenuMovePosition');
                }

                $('#list-menu-move').animate({'margin-left': mf});

                if (TV.listControl.suitableWidth + mf < $('#list-menu').width())  
                    $('#list-right').removeClass('show');  
        
                if (!$('#list-left').hasClass('show'))
                    $('#list-left').addClass('show');
            });

            $('#list-left').off('click').on('click', function() {  var 
                    width = $('.lastMenuMovePosition').width(),
                    mf = parseInt($('#list-menu-move').css('margin-left')) + width + 20;
            
                $('#list-menu-move').animate({'margin-left': mf});

                $('.lastMenuMovePosition').removeClass('lastMenuMovePosition').prev().addClass('lastMenuMovePosition');
              
                if ($('.lastMenuMovePosition').length == 0) {
                  $('#list-left').removeClass('show');  
                }

                if (!$('#list-right').hasClass('show'))
                    $('#list-right').addClass('show');
            });
        };
        
        var etime;
        function hoverAnimate() {
            $('.list-block-e').off('mouseenter').on('mouseenter', function() {
                if ($(this).hasClass('list-main-move-foucs')) return;
                if (etime) {
                    clearTimeout(etime);
                    etime = undefined;
                }

                var that = $(this);
                etime = setTimeout(function() {
                    onMouseEnter(that);
                }, 600);
            });

            $('.list-block-e').off('mouseleave').on('mouseleave', function() {
                if (etime) {
                    clearTimeout(etime);
                    etime = undefined;
                }

                if ($(this).hasClass('list-main-move-foucs')) return;
                
                var target = $(this);
                if ($(this).find('.list-block-e1-text-cont').length != 0) {
                    $(this).find('.list-block-e1-text-cont').animate({'height': '58px'}, 500, function() {
                        refineTdHeight(target);
                    });
                }
                else {
                    $(this).find('.list-block-e2-text-cont').animate({'height': '28px'}, 500, function() {
                        refineTdHeight(target);
                    });
                }
                
            });
        };

        function refineTdHeight(target) {
            var text = target.find('.list-block-name').text();
                target.find('td').text(text);
            var str = target.find('td').text().replace(/\s*\r?\n\s*/g, "");
            if (str.length > 14)  target.find('td').removeClass('list-block-table');     
        };

        function onMouseEnter(target) {
            var text = target.find('.list-block-info').text();  
                target.find('td').text(text);
                target.find('td').addClass('list-block-table');
                target.children().children().eq(0).animate({'height': '100%'}, 500);
                YX.Read.PointerRead(text); 
        };

        function tableCell() {
            $('.list-block-e').find('td').each(function() {
                var str = $(this).text().replace(/\s*\r?\n\s*/g, "");
                if (str.length < 14) {
                    $(this).addClass('list-block-table');
                }
            });
        };

        function headerShow() {
            $('.list-title-e').removeClass('show');
            
            if (TV.Configure.runtime.system == 'local' ||
            TV.Configure.runtime.system == 'national') {
                $('#list-column').addClass('show');
            }
            else {
                $('#list-title').addClass('show');
            }
        }
        
        function isFirst() {
            if (TV.Configure.runtime.pm.d) {
                list.listFoucs();
                list.listMainShow();
            }
            else {
                if ($('#list-menu-move').html() == '') {
                    location.hash = '#/' + 'list/' 
                                  + TV.Configure.runtime.system 
                                  + '/' + TV.Configure.runtime.pm.a 
                                  + '/' + TV.Configure.runtime.pm.b
                                  + '/' + TV.Configure.runtime.pm.c 
                                  + '/' + 0;
                }
                else {
                    var did = $('#list-menu .menu-e').eq(0).attr('did');
                    location.hash = '#/' + 'list/' 
                                  + TV.Configure.runtime.system 
                                  + '/' + TV.Configure.runtime.pm.a 
                                  + '/' + TV.Configure.runtime.pm.b
                                  + '/' + TV.Configure.runtime.pm.c 
                                  + '/' + did;
                }
            } 
        }

        function renderImg(cont) {
            var cont = $('.list-block-e');

            cont.each(function() {
                var imageSrc = $(this).attr('item-image'),
                    that = $(this);

                TV.Helper.loadImg(imageSrc, function(src) {
                    that.css('background-image', 'url(' + src + ')');
                    that.addClass('imgsuccess');
                }, function() {
                    if (that.hasClass('list-block-e1')) {
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
        headerShow();
        mainClick();
        menuClick();
        backClick();
        hoverAnimate();
        isFirst();
        tableCell();
        menuMoveClick();
        TV.Sound.resetPointerReader();    
    };
 
    TV.List();
});
