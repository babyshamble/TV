;
if(typeof(undefined) == typeof(TV)) TV={};

TV.Chapter = function(){
    var chapter = TV.Chapter;

    var 
        TRANSFORMER = /<p[^>]*>|<\/p[^>]*>|<P[^>]*>|<\/P[^>]*>|<font[^>]*>|<\/font[^>]*>|<div[^>]*>|<\/div[^>]*>|<br[^>]*>|<span[^>]*>|<\/span[^>]*>|<table[^>]*>|<\/table[^>]*>|<tbody[^>]*>|<\/tbody[^>]*>|<td[^>]*>|<\/td[^>]*>|<tr[^>]*>|<\/tr[^>]*>|\n/g,
        blank = /\s/ig,
        img = /<img[^>]*?(src="[^"]*?")[^>]*?>/g;

    chapter.init = function(data) {
        if (!data) return;
        return(refineData(data));
    };

    function refineData(e) {
        var 
            cache = e.replace(/(&quot;)/ig,"\"").replace(/(&gt;)/ig,">").replace(/(&lt;)/ig,"<").replace(/(&nbsp;)/ig,"").split(TRANSFORMER),
            res = [];

        for (var i=0; i<cache.length; i++) {
            if (cache[i] != '' && cache[i] != '\n' && cache[i] != '\r') {
                res.push(cache[i]);
            }
        }       

        // 按规则将图片 文字分组 统计字数
        var at = [], strSUM = 0;
    
        for (var i=0; i<res.length; i++) {
            var mask = res[i].match(img);
            if(mask) var imgLength = mask.length;

            if (mask) {
                if (at.length != 0 && at[at.length - 1].type != 'text' && !at[at.length - 1].data) {
                    at[at.length - 1].type = 'imgs';
                    at[at.length - 1].img = at[at.length - 1].img.concat(mask);
                } else {
                    var r = {};
                    at.push(r);
                    if (imgLength == 1) {
                        at[at.length - 1].type = 'img'; 
                    } else {
                        at[at.length - 1].type = 'imgs'; 
                    }
                    
                    at[at.length - 1].img = [];
                    at[at.length - 1].img = at[at.length - 1].img.concat(mask);
                }
            }
            else {
                res[i] = res[i].replace(/\s+/ig, '');
                if (res[i] != '') {
                    strSUM += res[i].length;
                    if (at.length == 0) {
                        var r = {};
                        at.push(r);
                        at[at.length - 1].type = 'text';
                        at[at.length - 1].data = [];
                        at[at.length - 1].data.push(res[i]);
                        at[at.length - 1].strNum = [];
                        at[at.length - 1].strNum.push(res[i].length);
                    }
                    else if (at.length != 0 && at[at.length - 1].type == 'text') {
                        at[at.length - 1].data.push(res[i]);
                        at[at.length - 1].strNum.push(res[i].length);
                    }
                    else if (at.length != 0 && at[at.length - 1].type != 'text') {
                        if (!at[at.length - 1].data || at[at.length - 1].data.length == 0) {
                            at[at.length - 1].data = [];
                            at[at.length - 1].data.push(res[i]);
                        }
                        else {
                            var r = {};
                            at.push(r);
                            at[at.length - 1].type = 'text';
                            at[at.length - 1].data = [];
                            at[at.length - 1].data.push(res[i]);
                        }
                        at[at.length - 1].strNum = [];
                        at[at.length - 1].strNum.push(res[i].length);
                    }
                }
            }
        }

        // 计算字数的比例
        for (var i=0; i<at.length; i++) {
            if (!at[i].strNum) continue;
            at[i].proportion = [];
            for (var j=0; j<at[i].strNum.length; j++) {
                at[i].proportion[j] = Math.round((at[i].strNum[j] / strSUM) * 100);
            }
        }  

        // 切分过长句子
        for (var i=0; i<at.length; i++) {
            if (!at[i].data) continue;
 
            for (var j=0; j<at[i].data.length; j++) {
                var cache = [];
                if(at[i].data[j].length > limitMax) {
                    cutInPeriod(cache, at[i].data[j]);
                    at[i].data[j] = cache;
                }
            }
        }

        // 多余的数组合并
        for (var i=0; i<at.length; i++) {
            if (!at[i].data) continue;
            
            var res = at[i].data,
                cache = [];
            for (var j=0; j<res.length; j++) {
                if (Object.prototype.toString.call(res[j]) == "[object String]") {
                    cache.push(res[j]);
                }
                if (Object.prototype.toString.call(res[j]) == "[object Array]") {
                    for (var d=0; d<res[j].length; d++) {
                        cache.push(res[j][d]);
                    }
                }
            }
            at[i].data = cache;

            if (at[i].type == 'text') {
                chapterJoinTogether(at[i].data);
                at[i].data = target;
            }
        }
        
        return at;
    }

/***************************分段*************************
1.如遇到超过120字的大段连续用2分法，保证每段不超过60
2.将所有分好的段拼接，每段仍然不超过60字
*/

    var 
        target,
        SECTENCE = /。|？|，|,|！|!|；|;|:|：/g,
        limitMin = 80,
        limitMax = 95;


    function cutInPeriod (arr, str, type) {
        var centerSeekMask = parseInt(str.length / 2),
            res = str.charAt(centerSeekMask),
            beforStr, afterStr,
            re = /。|？|！|!/g;
    
        if (re.test(res)) {
            beforStr = str.substring(0, centerSeekMask+1);
            afterStr = str.substring(centerSeekMask+1, str.length+1);
            cutReturn(arr, beforStr);
            cutReturn(arr, afterStr);
        } 
        else {
            var beforSeekMask = findSeekMask(centerSeekMask, str, 'before', 'period'); beforSeekMask = beforSeekMask ? beforSeekMask : 0;

            var afterSeekMask = findSeekMask(centerSeekMask, str, 'after', 'period'); afterSeekMask = afterSeekMask ? afterSeekMask : 0;
            
            // 如果前后都没有标点
            if (beforSeekMask == 0 && afterSeekMask == 0) {
                cutINComma(arr, str);
            } // 如果前没有标点
            else if (beforSeekMask == 0 && afterSeekMask != 0) {
                beforStr = str.substring(0, afterSeekMask+1);
                afterStr = str.substring(afterSeekMask+1, str.length+1);
                cutReturn(arr, beforStr);
                cutReturn(arr, afterStr);
            }// 如果后没有标点
            else if (beforSeekMask != 0 && afterSeekMask == 0) {
                beforStr = str.substring(0, beforSeekMask+1);
                afterStr = str.substring(beforSeekMask+1, str.length+1);
                cutReturn(arr, beforStr);
                cutReturn(arr, afterStr);
            }
            else if (beforSeekMask != 0 && afterSeekMask != 0) {// 如果前后均找到了标点
                //选beforSeekMask
                if (centerSeekMask - beforSeekMask < afterSeekMask - centerSeekMask) {
                    beforStr = str.substring(0, beforSeekMask+1);
                    afterStr = str.substring(beforSeekMask+1, str.length+1);
                    cutReturn(arr, beforStr);
                    cutReturn(arr, afterStr);
                } // afterSeekMask
                else{
                    beforStr = str.substring(0, afterSeekMask+1);
                    afterStr = str.substring(afterSeekMask+1, str.length+1);
                    cutReturn(arr, beforStr);
                    cutReturn(arr, afterStr);
                }
            }
        }
    }; 

     // 如果没有句号再以逗号切分
    function cutINComma(arr, str) {
        var centerSeekMask = parseInt(str.length / 2),
            res = str.charAt(centerSeekMask),
            beforStr, afterStr,
            re = /，|,|；|：|:/g;

        if (re.test(res)) {
            beforStr = str.substring(0, centerSeekMask+1);
            afterStr = str.substring(centerSeekMask+1, str.length+1);
            cutReturn(arr, beforStr);
            cutReturn(arr, afterStr);
        } 
        else {
            var beforSeekMask = findSeekMask(centerSeekMask, str, 'before', 'comma'); beforSeekMask = beforSeekMask ? beforSeekMask : 0;

            var afterSeekMask = findSeekMask(centerSeekMask, str, 'after', 'comma'); afterSeekMask = afterSeekMask ? afterSeekMask : 0;
            
            // 如果前后都没有标点
            if (beforSeekMask == 0 && afterSeekMask == 0) {
                beforStr = str.substring(0, centerSeekMask+1);
                afterStr = str.substring(centerSeekMask+1, str.length+1);
                cutReturn(arr, beforStr);
                cutReturn(arr, afterStr);
            } // 如果前没有标点
            else if (beforSeekMask == 0 && afterSeekMask != 0) {
                beforStr = str.substring(0, afterSeekMask+1);
                afterStr = str.substring(afterSeekMask+1, str.length+1);
                cutReturn(arr, beforStr);
                cutReturn(arr, afterStr);
            }// 如果后没有标点
            else if (beforSeekMask != 0 && afterSeekMask == 0) {
                beforStr = str.substring(0, beforSeekMask+1);
                afterStr = str.substring(beforSeekMask+1, str.length+1);
                cutReturn(arr, beforStr);
                cutReturn(arr, afterStr);
            }
            else if (beforSeekMask != 0 && afterSeekMask != 0) {// 如果前后均找到了标点
                //选beforSeekMask
                if (centerSeekMask - beforSeekMask < afterSeekMask - centerSeekMask) {
                    beforStr = str.substring(0, beforSeekMask+1);
                    afterStr = str.substring(beforSeekMask+1, str.length+1);
                    cutReturn(arr, beforStr);
                    cutReturn(arr, afterStr);
                } // afterSeekMask
                else{
                    beforStr = str.substring(0, afterSeekMask+1);
                    afterStr = str.substring(afterSeekMask+1, str.length+1);
                    cutReturn(arr, beforStr);
                    cutReturn(arr, afterStr);
                }
            }
        }
    };

    function findSeekMask(centerSeekMask, str, type, re) {
        if (re == 'period') {
            var re = /。|？|！|!/g; 
        }

        else if (re == 'comma') {
            var re = /，|,|；|：|:|：/g;
        }
        
        if (type == 'before') {
            for (var i=centerSeekMask; i>0; i--) {
                if (re.test(str.charAt(i))) {
                    return i;
                }
            }
        }

        if (type == 'after') {
            for (var i=centerSeekMask+1; i<str.length-1; i++) {
                if (re.test(str.charAt(i))) {
                    return i;
                }
            }
        }   
    };

    function cutReturn(arr, str) {
        if (str.length <= limitMax) {
            arr.push(str);
        } 
        else {
            cutInPeriod(arr, str);
        }
    }; 

    /*****************end分段**************/

    var 
        res = [],
        wordsNUM = 0, 
        groupNUM = 0;

    /***************************段落拼接*************************/
    var pNUM = 0, PLIMIT = 6;
    function chapterJoinTogether(cache) {
        if (cache.length == 0 && res.length !=0) {
            chapterWrapHTML(res);
            wordsNUM = 0; 
            groupNUM = 0;
            res = [];
        }
     
        if (cache.length == 0) return;
        var cacheChapter;

        if (groupNUM == 0 && !res[groupNUM]) res[groupNUM] = [];
        
        cacheChapter = cache.shift(); 
   
        pNUM++;
        if (pNUM > PLIMIT) {
            cache.unshift(cacheChapter);
            pNUM = 0;
            wordsNUM = 0;
            groupNUM++;
            res[groupNUM] = [];
            chapterJoinTogether(cache);
        } else {
            wordsNUM += cacheChapter.length;

            if (wordsNUM <= limitMax) {
                res[groupNUM].push(cacheChapter);
                chapterJoinTogether(cache);
            } else {
                cache.unshift(cacheChapter);
                pNUM = 0;
                wordsNUM = 0;
                groupNUM++;
                res[groupNUM] = [];
                chapterJoinTogether(cache);
            }
        }
    };

    function chapterWrapHTML(res) {
        var chapter = {};
        
        for (var i=0; i <res.length; i++) {
            if (!res[i]) return;
            chapter[i] = {};

            for (var d=0; d<res[i].length; d++) {
                if (!res[i][d]) return;
                var text = '<p class="art-main-p">';
                var sentence = mergeShortWord(res[i][d]);
                var st = [], inner = '', j = 0;
             
                for (var j=0; j<sentence.length; j++) {
                    inner += '<span class="art-main-span">' + sentence[j] + '</span>';
                    st.push(sentence[j]);
                }

                text += inner;
                text += '</p>';
                 
                if (st.length == 0) return;

                if (!chapter[i].html) {
                    chapter[i].html = text;
                }   
                else {
                    chapter[i].html = chapter[i].html + text;
                }
                
                if (!chapter[i].data) {
                    chapter[i].data = st; 
                }
                else {
                    chapter[i].data = chapter[i].data.concat(st);
                }
            }
        }
          
        target = chapter;
    };

    var 
        mergeLimit = 3,
        dotNUM = 0, 
        wordNUM = 0, 
        start = 0, 
        wordSTORE = 1;

    function mergeShortWord(str) {
        var res = [];
        
        if (str.length < mergeLimit) {
            res.push(str);
        } 
        else {
            if (!SECTENCE.test(str)) {
                res.push(str);
            }
            else {
                dotNUM = 0; 
                wordNUM = 0;
                start = 0; 
                wordSTORE = 1;
                str = str.replace(/\s/g, "");

                for (var i=0; i<str.length; i++) {
                    if (SECTENCE.test(str[i])) {
                        dotNUM++;
                        wordNUM = wordSTORE - dotNUM;
                    }

                    if (wordNUM >= mergeLimit) {
                        res.push(str.substring(start, i+1));
                        wordNUM = 0;
                        wordSTORE = 0;
                        dotNUM = 0; 
                        start = i+1;
                    }

                    if (i == str.length - 1 && wordNUM < mergeLimit) {
                        var x = str.substring(start, i+1);
                        if (!res[res.length - 1]) {
                            res.push(x);
                        }
                        else {
                           res[res.length - 1] += x; 
                        }   
                    }

                    wordSTORE++;
                } 
            }               
        }
        
        return res;
    };

    function removeEmpty(data) {
        var res = [],
            re = /\s/ig;

        for (var i=0; i<data.length; i++) {
            data[i] = data[i].replace(re, '');
            if (data[i] != '') { 
                res.push(data[i]);
            }
        }

        return res;
    };

};

TV.Chapter();
