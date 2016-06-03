if(typeof(TV)=="undefined") var TV={};


TV.artControl = function(){
    var lastPMD= -1;

    this.show = function() {
    	var 
            url = 'html/art.html',
            cont = $('#art-container');
            TV.Helper.loadHtml(cont, url);
            lastPMD = TV.Configure.runtime.pm.d;
    };
};
