$(function() {
    // if(typeof(TV)=="undefined") var TV={};
   
    TV.National = function(){

        function createGrid() {
            $('.national-grid').each(function() {
                var gridWidth = 540,
                    gridLeft = $(this).index() * gridWidth + ($(this).index()+1) * 20;

                $(this).css('left', gridLeft + 'px');
            });

            $('.national-grid-e').each(function() {
                var gridEwidth = 260,
                    gridEheight = 210;
     
                if ($(this).index() == 1) {
                     $(this).css('left', gridEwidth + $(this).index() * 20 + 'px');
                }

                if ($(this).index() == 2) {
                     $(this).css('top', gridEheight + $(this).index() * 20 + 'px');
                }

                if ($(this).index() == 3) {
                    $(this).css({
                        'left': gridEwidth + 20 + 'px',
                        'top': gridEheight + 40 + 'px'
                    })
                }
            });
        };

        function mainClick() {
            $('#national-main .national-grid-e').off('click').on('click', function() {

                if ($(this).hasClass('national-main-move-foucs')) {
                    var did = $(this).attr('did');
                    location.hash = '#/' + 'list/' + TV.Configure.runtime.system + '/' + TV.Configure.runtime.pm.a + '/' + did;
                    return;
                } else {
                    if (etime) {
                        clearTimeout(etime);
                        etime = undefined;
                    }

                    if (time) {
                        clearInterval(time);
                        time = undefined;
                    }

                    $('.national-main-move-foucs').removeClass('national-main-move-foucs').find('.national-grid-e-img').css('opacity', .5);
                    // $('.national-main-move-foucs').removeClass('national-main-move-foucs').trigger('mouseleave');
                    
                    $(this).addClass('national-main-move-foucs').find('.national-grid-e-img').css('opacity', 1);
                    // $('.national-main-move-foucs').find('.national-grid-item-rolling').trigger('mouseenter');

                    var 
                        distance = 0,
                        index = $(this).index(),
                        selfDistance = $(this).width(),
                        parentDistance = $(this).parent().index() * $(this).parent().width();
                    
                    if (index == 0 || index == 2) {
                        if ($(this).parent().index() == 0) {
                           distance = 0;
                        } else {
                            distance = parentDistance - (selfDistance / 2);
                        }
                    } else {
                        distance = parentDistance + $(this).parent().index()*20 + selfDistance / 2;
                    }

                    $(this).parent().parent().animate({
                        left: -(distance)
                    }, 800);

                }
            });
        };

        function menuClick() {
            $('#national-menu .menu-e').off('click').on('click', function() {
                var did = $(this).attr('did');
                if (did == TV.Configure.runtime.pm.a) return;
                
                $('#'+TV.Configure.runtime.system).addClass('fromMenu');
                location.hash = '#/' + 'home/' + TV.Configure.runtime.system + '/' + did;
                return;
            });
        };

        function rollingClick() {
            $('.national-grid-item-rolling-title').off('click').on('click', function() {
                var did = $(this).attr('did');
          
                location.hash = '#/' + 'list/' + TV.Configure.runtime.system + '/' + TV.Configure.runtime.pm.a + '/' + did;
                
                return false;
            });

            $('.national-grid-item-rolling-e').off('click').on('click', function() {
                    var did = $(this).attr('did');
            
                    location.hash = '#/' + 'art/' + TV.Configure.runtime.system + '/' + TV.Configure.runtime.pm.a + '/0' + '/0' + '/0' + '/' + did; // 直接从首页点击进入正文
                    return false;
            });
        };

        function menuMoveClick() {
            $('#national-right').off('click').on('click', function() {
                if ($('.lastMenuMovePosition').length == 0) {
                    var mf = -($('#national-menu-move .menu-e').eq(0).width()) - 20;

                    $('#national-menu-move .menu-e').eq(0).addClass('lastMenuMovePosition');
                }
                else {
                    var width = $('.lastMenuMovePosition').next().width(),
                        mf = parseInt($('#national-menu-move').css('margin-left')) - width - 20;

                    $('.lastMenuMovePosition').removeClass('lastMenuMovePosition').next().addClass('lastMenuMovePosition');
                }

                $('#national-menu-move').animate({'margin-left': mf});

                if (TV.homeControl.suitableWidth + mf < $('#national-menu').width()) 
                    $('#national-right').removeClass('show');  
        
                if (!$('#national-left').hasClass('show'))
                    $('#national-left').addClass('show');
            });

            $('#national-left').off('click').on('click', function() {  var 
                    width = $('.lastMenuMovePosition').width(),
                    mf = parseInt($('#national-menu-move').css('margin-left')) + width + 20;
            
                $('#national-menu-move').animate({'margin-left': mf});

                $('.lastMenuMovePosition').removeClass('lastMenuMovePosition').prev().addClass('lastMenuMovePosition');
              
                if ($('.lastMenuMovePosition').length == 0) {
                  $('#national-left').removeClass('show');  
                }

                if (!$('#national-right').hasClass('show'))
                    $('#national-right').addClass('show');
            });
        };

        var etime = undefined;
        function hoverAnimate() {
            $('.national-grid-e').off('mouseenter').on('mouseenter', function() {
                if (etime) {
                    clearTimeout(etime);
                    etime = undefined;
                }
                var that = $(this);

                etime = setTimeout(function() {
                    that.find('.national-grid-item').slideUp(1000, function() {
                        if (!etime) return;
                        nationalRolling(that);
                    });
                }, 1000);
            });

            $('.national-grid-e').off('mouseleave').on('mouseleave', function() {
                $(this).find('.national-grid-item').slideDown(1000);
                clearnationalRolling($(this)); 
            });
        };

        var time = undefined;
        function nationalRolling(target) {
            if (time) {
                clearInterval(time);
                time = undefined;
            }

            time = setInterval(function() {
                if (!etime) {
                    clearInterval(time);
                    return;   
                }
                
                var cont = target.find('.national-grid-item-rolling-cont');
                cont.children().eq(0).animate({height: 0}, 1000, function() {
                    cont.append(cont.children().eq(0));
                    cont.children().css('height', '160px');
                });

            }, 2000);
        };

        function clearnationalRolling(target) {
            if (etime) {
                clearTimeout(etime);
                etime = undefined;
            }

            if (time) {
                clearInterval(time);
                time = undefined;
            }

            var cont = target.siblings().find('.national-grid-item-rolling-cont');
            cont.children().css('height', '160px');
        };

        function isFirst() {
            if (TV.Configure.runtime.pm.a) {
                var home = new TV.homeControl();
                home.homeFoucs();
                home.homeMainShow();
            }
            else {
                var did = $('#national-menu .menu-e').eq(0).attr('did');
                location.hash = '#/' + 'home/' + TV.Configure.runtime.system + '/' + did;
            }
        };

        function renderImg(cont) {
            var cont = $('.national-item-image');

            cont.each(function() {
                var imageSrc = $(this).attr('item-image'),
                    that = $(this);

                TV.Helper.loadImg(imageSrc, function(src) {
                    that.css('background-image', 'url(' + src + ')');
                    that.addClass('imgsuccess');
                }, function() {
                    that.css('background-image', 'url(imgs/img-local.jpg)');
                    that.addClass('imgfalse');
                });
            });
        };

        renderImg();
        createGrid();
        menuClick();
        mainClick();
        rollingClick();
        menuMoveClick();
        hoverAnimate(); 
        isFirst(); 
        TV.Sound.resetPointerReader();
    };

    TV.National();
});


