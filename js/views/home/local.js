$(function() {
    // if(typeof(TV)=="undefined") var TV={};

    TV.Local = function(){

        function createGrid() {
            $('.local-grid').each(function() {
                var gridWidth = 540,
                    gridLeft = $(this).index() * gridWidth + ($(this).index()+1) * 20;

                $(this).css('left', gridLeft + 'px');
            });

            $('.local-grid-e').each(function() {
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
            $('#local-main .local-grid-e').off('click').on('click', function() {

                if ($(this).hasClass('local-main-move-foucs')) {
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

                    $('.local-main-move-foucs').removeClass('local-main-move-foucs').find('.local-grid-e-img').css('opacity', .5);
                    //$('.local-main-move-foucs').removeClass('local-main-move-foucs').trigger('mouseleave');
                    
                    $(this).addClass('local-main-move-foucs').find('.local-grid-e-img').css('opacity', 1);
                    // $('.local-main-move-foucs').find('.local-grid-item-rolling').trigger('mouseenter');
       
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
            $('#local-menu .menu-e').off('click').on('click', function() {
                var did = $(this).attr('did');
                if (did == TV.Configure.runtime.pm.a) return;
                
                $('#'+TV.Configure.runtime.system).addClass('fromMenu');
                location.hash = '#/' + 'home/' + TV.Configure.runtime.system + '/' + did;
                return;
            });
        };

        function rollingClick() {
            $('.local-grid-item-rolling-title').off('click').on('click', function() {
                var did = $(this).attr('did');
          
                location.hash = '#/' + 'list/' + TV.Configure.runtime.system + '/' + TV.Configure.runtime.pm.a + '/' + did;
                return false;
            });

            $('.local-grid-item-rolling-e').off('click').on('click', function() {
                    var did = $(this).attr('did');
            
                    location.hash = '#/' + 'art/' + TV.Configure.runtime.system + '/' + TV.Configure.runtime.pm.a + '/0' + '/0' + '/0' + '/' + did; // 直接从首页点击进入正文
                    return false;
            });
        };

        function menuMoveClick() {
            $('#local-right').off('click').on('click', function() {
                if ($('.lastMenuMovePosition').length == 0) {
                    var mf = -($('#local-menu-move .menu-e').eq(0).width()) - 20;

                    $('#local-menu-move .menu-e').eq(0).addClass('lastMenuMovePosition');
                }
                else {
                    var width = $('.lastMenuMovePosition').next().width(),
                        mf = parseInt($('#local-menu-move').css('margin-left')) - width - 20;

                    $('.lastMenuMovePosition').removeClass('lastMenuMovePosition').next().addClass('lastMenuMovePosition');
                }


                $('#local-menu-move').animate({'margin-left': mf});

                if (TV.homeControl.suitableWidth + mf < $('#local-menu').width()) 
                    $('#local-right').removeClass('show');  
        
                if (!$('#local-left').hasClass('show'))
                    $('#local-left').addClass('show');
            });

            $('#local-left').off('click').on('click', function() {  var 
                    width = $('.lastMenuMovePosition').width(),
                    mf = parseInt($('#local-menu-move').css('margin-left')) + width + 20;
            
                $('#local-menu-move').animate({'margin-left': mf});

                $('.lastMenuMovePosition').removeClass('lastMenuMovePosition').prev().addClass('lastMenuMovePosition');
              
                if ($('.lastMenuMovePosition').length == 0) {
                  $('#local-left').removeClass('show');  
                }

                if (!$('#local-right').hasClass('show'))
                    $('#local-right').addClass('show');
            });
        };

        var etime = undefined;
        function hoverAnimate() {
            $('.local-grid-e').off('mouseenter').on('mouseenter', function() {
                if (etime) {
                    clearTimeout(etime);
                    etime = undefined;
                }
                var that = $(this);

                etime = setTimeout(function() {
                    that.find('.local-grid-item').slideUp(1000, function() {
                        if (!etime) return;
                        localRolling(that);
                    });
                }, 1000);
            });

            $('.local-grid-e').off('mouseleave').on('mouseleave', function() {
                $(this).find('.local-grid-item').slideDown(1000);
                clearlocalRolling($(this)); 
            });
        };

        var time = undefined;
        function localRolling(target) {
            if (time) {
                clearInterval(time);
                time = undefined;
            }

            time = setInterval(function() {
                if (!etime) {
                    clearInterval(time);
                    return;   
                }
                
                var cont = target.find('.local-grid-item-rolling-cont');
                cont.children().eq(0).animate({height: 0}, 1000, function() {
                    cont.append(cont.children().eq(0));
                    cont.children().css('height', '160px');
                });

            }, 2000);
        };

        function clearlocalRolling(target) {
            if (etime) {
                clearTimeout(etime);
                etime = undefined;
            }

            if (time) {
                clearInterval(time);
                time = undefined;
            }

            var cont = target.siblings().find('.local-grid-item-rolling-cont');
            cont.children().css('height', '160px');
        };

        function isFirst() {
            if (TV.Configure.runtime.pm.a) {
                var home = new TV.homeControl();
                home.homeFoucs();
                home.homeMainShow();
            }
            else {
                var did = $('#local-menu .menu-e').eq(0).attr('did');
                location.hash = '#/' + 'home/' + TV.Configure.runtime.system + '/' + did;
            }
        };

        function renderImg(cont) {
            var cont = $('.local-item-image');

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

    TV.Local();
});
