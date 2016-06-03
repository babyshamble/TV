$(function() {
    // if(typeof(TV)=="undefined") var TV={};

    TV.listHeader = function(){
        var list = new TV.listControl();
  
        function headerClick() {
            $('.list-column-e').off('click').on('click', function() {
                var did = $(this).attr('did');
                if (did == TV.Configure.runtime.pm.c) return;
                
                location.hash = '#/' + 'list/' 
                              + TV.Configure.runtime.system + '/' 
                              + TV.Configure.runtime.pm.a + '/' 
                              + TV.Configure.runtime.pm.b + '/' 
                              + did;
                return;
            });
        };

        function backClick() {
            $('#list-back').off('click').on('click', function() {
                list.hide();
                if (TV.Configure.runtime.pm.b == 0) {
                    var did = $('#'+TV.Configure.runtime.system+'-menu').children().eq(0).attr('did');
                    location.hash = '#/' + 'home/' + TV.Configure.runtime.system + '/' + did;
                } else {
                    location.hash = '#/' + 'home/' 
                              + TV.Configure.runtime.system 
                              + '/' + TV.Configure.runtime.pm.a;
                }
                return;
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
            if (TV.Configure.runtime.pm.c) {
                list.listMainCreate();
            }
            else {
                if ($('#list-title').hasClass('show')) {
                    location.hash = '#/' + 'list/' 
                                  + TV.Configure.runtime.system 
                                  + '/' + TV.Configure.runtime.pm.a 
                                  + '/' + TV.Configure.runtime.pm.b 
                                  + '/' + 0;
                }
                else {
                    var did = $('.list-column-e').eq(0).attr('did');
                    location.hash = '#/' + 'list/' 
                                  + TV.Configure.runtime.system 
                                  + '/' + TV.Configure.runtime.pm.a 
                                  + '/' + TV.Configure.runtime.pm.b 
                                  + '/' + did;
                }
            } 
        }

        headerShow();
        headerClick();
        backClick();
        isFirst();
        TV.Sound.resetPointerReader();
            
    };
 
    TV.listHeader();
});
