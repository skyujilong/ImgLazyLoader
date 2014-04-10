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
    var querySelector = document.querySelectorAll || null;
    var viewHeight = root.innerheight || document.body.clientHeight;
    var viewWidth = root.innerwidth || document.body.clientWidth;
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
        ImgLazyLoader.imgQueue = [];
        if(config.selecter){
            ImgLazyLoader.selecter = config.selecter;
        }else{
            throw new Error("请输入选择器");
        }

        ImgLazyLoader.imgSource = config.imgSource || 'data-src';

        ImgLazyLoader.pushToImgQueue();
    };
    //目前仅支持class选择器
    ImgLazyLoader.pushToImgQueue = function(){
        if(querySelector){
            Array.prototype.forEach.call(querySelector(ImgLazyLoader.selecter),function(img){
                imgList.push(getImageInfo(img));
            });
        }else{
            var tmp_selecter = '/' + ImgLazyLoader.selecter.replace(/\./g,"") + '/';
            Array.prototype.forEach.call(document.images,function(img){
                if(eval(tmp_selecter).test(img.className)){
                    imgList.push(getImageInfo(img));
                }
            });
        }

    };

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

    root.onscroll = function(){
        var pos = getWindowLeftPoint();
        Array.prototype.forEach.call(imgList,function(img){
            if(pos.x >= img.x && pos.y >= img.y && !img.isRender){
                img.dom.src = img.imgUrl;
                img.isRender = true;
            }
        });
    };

    function getWindowLeftPoint(){
        return {
            x : root.screenLeft || root.screenX + root.innerwidth || document.body.clientWidth,
            y : root.screenTop || root.screenY + root.innerheight || document.body.clientHeight
        }
    }


    return ImgLazyLoader;
});
