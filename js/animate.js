if(typeof(TV)=="undefined") var TV={};

TV.Animate = function(){
    var animete = TV.Animate;
    
    var container;

    animete.menu = function(cont) {
        if (!cont) return;
        container = cont;
        menuAdd();
    };

    function menuAdd() {
        var mask = $('.m_nav').text().length;
        if (mask > 39) {
            $('#add').show();
            menuAnimate();
        }
    };

    function menuAnimate() {
        $('#add').off('click').on('click', function() {     
            var 
                mask = container.hasClass('animated'),
                standard = $('#menu').height();

            if (mask) {
                container.animate({'height': '50px'}, 1000, function() {
                    container.removeClass('animated');
                });
            } else {
                var height = Math.ceil($('.m_nav').text().length / 39) * standard;
                container.animate({'height': height + 'px'}, 1000, function() {
                    container.addClass('animated');
                });
            }
        });
    };
};
