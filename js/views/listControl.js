if(typeof(TV)=="undefined") var TV={};


TV.listControl = function(){
    var lastPMB= -1, lastPMC = -1, lastPMD = -1

    this.show = function() {
        if (TV.Configure.runtime.pm.c == 0 &&
            TV.Configure.runtime.pm.b == 0 &&
            TV.Configure.runtime.pm.d == 0) return;
            
        if (TV.Configure.runtime.pm.c == lastPMC &&
            TV.Configure.runtime.pm.d == lastPMD) return;

        if ($('#list').hasClass('fromMenu')) {
            // 执行菜单切换动画
            ListMainChange();
            this.listFoucs();
        } else {
            if ($('#list').html() == '') {
                $('#list').removeClass('animated fadeOutRight').css('display', 'block');
                var 
                    url = 'html/list-header.html',
                    cont = $('#list');
                    TV.Helper.loadHtml(cont, url);
                    lastPMB = TV.Configure.runtime.pm.b;
                    lastPMC = TV.Configure.runtime.pm.c;
                    lastPMD = TV.Configure.runtime.pm.d;
                    return;                
            }
           
            if (lastPMC != TV.Configure.runtime.pm.c ||
                $('#list-main').html() == ''){
                this.listMainCreate();
                lastPMB = TV.Configure.runtime.pm.b;
                lastPMC = TV.Configure.runtime.pm.c;
                lastPMD = TV.Configure.runtime.pm.d;
                return;
            }

            this.listFoucs();
            this.listMainShow();
        }
        
        lastPMB = TV.Configure.runtime.pm.b;
        lastPMC = TV.Configure.runtime.pm.c;
        lastPMD = TV.Configure.runtime.pm.d;
    }; 

    this.listMainCreate = function() {
        if (TV.Configure.runtime.pm.c == 'l31' ||
         TV.Configure.runtime.pm.c == 0) {
            var url = 'html/list-main.html';
        }
        else {
            var url = 'html/list-main2.html';
        }
        var 
            cont = $('#list-main');
            TV.Helper.loadHtml(cont, url);                
    };

    this.hide = function() {
        $('#list').fadeOut(500, function() {
            $('#list').html('');  
        });
        $('#list').removeClass('fadeInRight');
        $('#list').addClass('animated fadeOutRight');      
    };

    function ListMainChange() {
        $('.list-main-foucs').fadeOut(500, function() {
            $('.list-main-foucs').removeClass('show list-main-foucs');
            $('#list-main-move-'+TV.Configure.runtime.pm.d).addClass('list-main-foucs').fadeIn();
            $('#list').removeClass('fromMenu');
        });
    };

    this.listMainShow = function() {
        var cont = $('#list-main');

        cont.removeClass('animated fadeInRight').addClass('fadeOutRight').hide(1);
        
        var mask;
        TV.Configure.runtime.pm.d == 0 ? mask = TV.Configure.runtime.pm.c : mask = TV.Configure.runtime.pm.d;

        $('#list-main-move-'+mask).addClass('show list-main-foucs');      
        cont.removeClass('fadeOutRight');
        cont.addClass('animated fadeInRight');
        cont.fadeIn(300, function() {
            showMoveArrow();
        });
    };


    function showMoveArrow() {
        var suitableWidth = 0;
        $('#'+TV.Configure.runtime.webkind+'-menu-move').children().each(function() {
            suitableWidth += $(this).width() + 20;
              
        });
        
        if (suitableWidth > $('#'+TV.Configure.runtime.webkind+'-menu').width()) {
            $('#'+TV.Configure.runtime.webkind+'-right').addClass('show');
        }

        TV.listControl.suitableWidth = suitableWidth;
    };

    this.listFoucs = function() {
        if (TV.Configure.runtime.system == 'local' ||
            TV.Configure.runtime.system == 'national') {
            $('.list-column-e').removeClass('list-column-foucs');
            $('#'+TV.Configure.runtime.webkind+'-column-e-'+TV.Configure.runtime.pm.c).addClass('list-column-foucs');
        }

        if ($('#list-menu').html() != '') {
            $('#list-menu').find('.menu-e').removeClass('menu-foucs');
            $('#'+TV.Configure.runtime.webkind+'-menu-e-'+TV.Configure.runtime.pm.d).addClass('menu-foucs');
        }
    };
};
