if(typeof(TV)=="undefined") var TV={};


TV.homeControl = function(){
    var lastPMA= -1;

    this.show = function() {
        if (lastPMA == TV.Configure.runtime.pm.a) return;
        lastPMA = TV.Configure.runtime.pm.a;

        if ($('#home-main').find($('#'+TV.Configure.runtime.system)).length == 0) {
            var 
                url = 'html/'+TV.Configure.runtime.system+'.html',
                div = '<div id="'+TV.Configure.runtime.system+'" class="home-main-e"></div>';
                $('#home-main').append(div);
            var 
                cont = $('#'+TV.Configure.runtime.system);
                TV.Helper.loadHtml(cont, url);

            headerClick();
        }
        else {
            if ($('#'+TV.Configure.runtime.system).hasClass('fromMenu')) {
                homeMainChange();
                $('#'+TV.Configure.runtime.system).removeClass('fromMenu');
            } else {
                this.homeMainShow();
            }
        
            this.homeFoucs();
        }
    }; 

    function homeMainChange() {
        $('.home-main-foucs').fadeOut(500, function() {
            $('.home-main-foucs').removeClass('show home-main-foucs');
            $('#'+TV.Configure.runtime.system+'-main-move-'+TV.Configure.runtime.pm.a).addClass('home-main-foucs').fadeIn();
        });
    };

    this.homeMainShow = function() {
        var cont = $('#'+TV.Configure.runtime.system);

        $('.home-main-e').removeClass('animated fadeInRight').addClass('fadeOutRight').hide(1);

        $('#'+TV.Configure.runtime.system+'-main-move-'+TV.Configure.runtime.pm.a).addClass('show home-main-foucs');
        
        cont.fadeIn(500, function() {
            showMoveArrow();
        });

        cont.removeClass('fadeOutRight');
        cont.addClass('animated fadeInRight');
    };

    function showMoveArrow() {
        var suitableWidth = 0;
        $('#'+TV.Configure.runtime.system+'-menu-move').children().each(function() {
            suitableWidth += $(this).width() + 20;
              
        });
        
        if (suitableWidth > $('#'+TV.Configure.runtime.system+'-menu').width()) {
            $('#'+TV.Configure.runtime.system+'-right').addClass('show');
        }

        TV.homeControl.suitableWidth = suitableWidth;
    };

    this.homeFoucs = function() {
        $('.header-foucs').removeClass('header-foucs');
        $('#h-'+TV.Configure.runtime.system).addClass('header-foucs');
        $('#'+TV.Configure.runtime.system+'-menu').find('.menu-foucs').removeClass('menu-foucs');
        $('#'+TV.Configure.runtime.system+'-menu-e-'+TV.Configure.runtime.pm.a).addClass('menu-foucs');
    };

    function headerClick() {
        $('#home-header .home-header-e').off('click').on('click', function() {
            var did = $(this).attr('did');
            if (did == TV.Configure.runtime.system) return;

            if ($('#home-main').find($('#'+did)).length == 0) { 
                location.hash = '#/' + 'home/' + did;
                    return;
            } else {
                $('#'+did+'-menu .menu-e').each(function() {
                    if ($(this).hasClass('menu-foucs')) {
                        var sid = $(this).attr('did');
                        location.hash = '#/' + 'home/' + did + '/' + sid;
                        return;
                    }
                });
            }
        });   
    };

};
