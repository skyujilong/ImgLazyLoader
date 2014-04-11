/**
 * Created with JetBrains WebStorm.
 * User: yujilong
 * Date: 14-4-9
 * Time: 下午4:17
 * To change this template use File | Settings | File Templates.
 */


(function(root,factory){

    root.ImgLazyLoader = factory(root,{});

})(this,function(root,ImgLazyLoader){
    var getElementByClass = document.getElementsByClassName || null;
    var viewHeight , viewWidth;
    var last_pos = {
        x : 0,
        y : 0
    };
    //对应的所有要显示的dom集合
    var imgList = [];
    var previousImgLazyLoader = root.ImgLazyLoader;
    /**
     * 当命名冲突的时候调用该方法
     * @returns {*}
     */
    ImgLazyLoader.noConflict = function(){
        root.ImgLazyLoader = previousImgLazyLoader;
        return this;
    };
    /**
     * 根据给定的element来获取相对应的位置
     * @param ele
     */
    function getEleOffset(ele){
        var offsetTop = ele.offsetTop;
        var offsetLeft = ele.offsetLeft;
        while(ele = ele.offsetParent){
            offsetTop += ele.offsetTop;
            offsetLeft += ele.offsetLeft;
        }
        return {
            x : offsetLeft,
            y : offsetTop
        }
    }

    ImgLazyLoader.init = function(config){
        viewHeight = root.innerHeight || document.documentElement.clientHeight;
        viewWidth = root.innerWidth || document.documentElement.clientWidth;
        ImgLazyLoader.imgQueue = [];
        if(config.selecter){
            ImgLazyLoader.selecter = config.selecter;
        }else{
            throw new Error("请输入选择器");
        }

        ImgLazyLoader.imgSource = config.imgSource || 'data-src';

        ImgLazyLoader.pushToImgQueue();
        /**
         * 首次加载的时候 直接执行第一屏的渲染操作
         */
        renderImg();
    };
    //目前仅支持class选择器
    ImgLazyLoader.pushToImgQueue = function(){
        if(document.querySelectorAll){
            if(Array.prototype.forEach){
                Array.prototype.forEach.call( document.querySelectorAll(ImgLazyLoader.selecter),function(img){
                    imgList.push(getImageInfo(img));
                });
            }else{
                forEach(document.querySelectorAll(ImgLazyLoader.selecter),function(img){
                    imgList.push(getImageInfo(img));
                });
            }
        }else{
            var tmp_selecter = '/' + ImgLazyLoader.selecter.replace(/\./g,"") + '/';
            if(Array.prototype.forEach){
                Array.prototype.forEach.call(document.images,function(img){
                    if(eval(tmp_selecter).test(img.className)){
                        imgList.push(getImageInfo(img));
                    }
                });
            }else{
                forEach(document.images,function(img){
                    if(eval(tmp_selecter).test(img.className)){
                        imgList.push(getImageInfo(img));
                    }
                });
            }

        }

    };

    function forEach(list,callback){
        for(var i = 0, len = list.length; i < len; i ++){
            callback(list[i],i);
        }
    }

    function getImageInfo(ele){
        var offset = getEleOffset(ele);
        return {
            isRender:false,
            dom : ele,
            imgUrl : ele.getAttribute(ImgLazyLoader.imgSource),
            x : offset.x,
            y : offset.y
        };
    }

    root.onscroll = renderImg;

   function renderImg(){
       var pos = getWindowLeftPoint();
       if(pos.x - last_pos.x > 500 || pos.y - last_pos.y > 500){
           last_pos = pos;
           Array.prototype.forEach.call(imgList,function(img){
               if(!img.isRender && pos.x > img.x && pos.y > img.y ){
                   img.dom.src = img.imgUrl;
                   img.isRender = true;
               }
           });
       }
   }

    function getWindowLeftPoint(){
        return {
            //提前加载的偏移量500
            x : root.pageXOffset + viewWidth + 500,
            y : root.pageYOffset + viewHeight + 500
        }
    }


    return ImgLazyLoader;
});
