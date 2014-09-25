// console.log polyfill
window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){console.log(Array.prototype.slice.call(arguments))}};

/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 1.0.2
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/
function FastClick(e,t){"use strict";function r(e,t){return function(){return e.apply(t,arguments)}}var n;t=t||{};this.trackingClick=false;this.trackingClickStart=0;this.targetElement=null;this.touchStartX=0;this.touchStartY=0;this.lastTouchIdentifier=0;this.touchBoundary=t.touchBoundary||10;this.layer=e;this.tapDelay=t.tapDelay||200;if(FastClick.notNeeded(e)){return}var i=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"];var s=this;for(var o=0,u=i.length;o<u;o++){s[i[o]]=r(s[i[o]],s)}if(deviceIsAndroid){e.addEventListener("mouseover",this.onMouse,true);e.addEventListener("mousedown",this.onMouse,true);e.addEventListener("mouseup",this.onMouse,true)}e.addEventListener("click",this.onClick,true);e.addEventListener("touchstart",this.onTouchStart,false);e.addEventListener("touchmove",this.onTouchMove,false);e.addEventListener("touchend",this.onTouchEnd,false);e.addEventListener("touchcancel",this.onTouchCancel,false);if(!Event.prototype.stopImmediatePropagation){e.removeEventListener=function(t,n,r){var i=Node.prototype.removeEventListener;if(t==="click"){i.call(e,t,n.hijacked||n,r)}else{i.call(e,t,n,r)}};e.addEventListener=function(t,n,r){var i=Node.prototype.addEventListener;if(t==="click"){i.call(e,t,n.hijacked||(n.hijacked=function(e){if(!e.propagationStopped){n(e)}}),r)}else{i.call(e,t,n,r)}}}if(typeof e.onclick==="function"){n=e.onclick;e.addEventListener("click",function(e){n(e)},false);e.onclick=null}}var deviceIsAndroid=navigator.userAgent.indexOf("Android")>0;var deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent);var deviceIsIOS4=deviceIsIOS&&/OS 4_\d(_\d)?/.test(navigator.userAgent);var deviceIsIOSWithBadTarget=deviceIsIOS&&/OS ([6-9]|\d{2})_\d/.test(navigator.userAgent);FastClick.prototype.needsClick=function(e){"use strict";switch(e.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(e.disabled){return true}break;case"input":if(deviceIsIOS&&e.type==="file"||e.disabled){return true}break;case"label":case"video":return true}return/\bneedsclick\b/.test(e.className)};FastClick.prototype.needsFocus=function(e){"use strict";switch(e.nodeName.toLowerCase()){case"textarea":return true;case"select":return!deviceIsAndroid;case"input":switch(e.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return false}return!e.disabled&&!e.readOnly;default:return/\bneedsfocus\b/.test(e.className)}};FastClick.prototype.sendClick=function(e,t){"use strict";var n,r;if(document.activeElement&&document.activeElement!==e){document.activeElement.blur()}r=t.changedTouches[0];n=document.createEvent("MouseEvents");n.initMouseEvent(this.determineEventType(e),true,true,window,1,r.screenX,r.screenY,r.clientX,r.clientY,false,false,false,false,0,null);n.forwardedTouchEvent=true;e.dispatchEvent(n)};FastClick.prototype.determineEventType=function(e){"use strict";if(deviceIsAndroid&&e.tagName.toLowerCase()==="select"){return"mousedown"}return"click"};FastClick.prototype.focus=function(e){"use strict";var t;if(deviceIsIOS&&e.setSelectionRange&&e.type.indexOf("date")!==0&&e.type!=="time"){t=e.value.length;e.setSelectionRange(t,t)}else{e.focus()}};FastClick.prototype.updateScrollParent=function(e){"use strict";var t,n;t=e.fastClickScrollParent;if(!t||!t.contains(e)){n=e;do{if(n.scrollHeight>n.offsetHeight){t=n;e.fastClickScrollParent=n;break}n=n.parentElement}while(n)}if(t){t.fastClickLastScrollTop=t.scrollTop}};FastClick.prototype.getTargetElementFromEventTarget=function(e){"use strict";if(e.nodeType===Node.TEXT_NODE){return e.parentNode}return e};FastClick.prototype.onTouchStart=function(e){"use strict";var t,n,r;if(e.targetTouches.length>1){return true}t=this.getTargetElementFromEventTarget(e.target);n=e.targetTouches[0];if(deviceIsIOS){r=window.getSelection();if(r.rangeCount&&!r.isCollapsed){return true}if(!deviceIsIOS4){if(n.identifier===this.lastTouchIdentifier){e.preventDefault();return false}this.lastTouchIdentifier=n.identifier;this.updateScrollParent(t)}}this.trackingClick=true;this.trackingClickStart=e.timeStamp;this.targetElement=t;this.touchStartX=n.pageX;this.touchStartY=n.pageY;if(e.timeStamp-this.lastClickTime<this.tapDelay){e.preventDefault()}return true};FastClick.prototype.touchHasMoved=function(e){"use strict";var t=e.changedTouches[0],n=this.touchBoundary;if(Math.abs(t.pageX-this.touchStartX)>n||Math.abs(t.pageY-this.touchStartY)>n){return true}return false};FastClick.prototype.onTouchMove=function(e){"use strict";if(!this.trackingClick){return true}if(this.targetElement!==this.getTargetElementFromEventTarget(e.target)||this.touchHasMoved(e)){this.trackingClick=false;this.targetElement=null}return true};FastClick.prototype.findControl=function(e){"use strict";if(e.control!==undefined){return e.control}if(e.htmlFor){return document.getElementById(e.htmlFor)}return e.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")};FastClick.prototype.onTouchEnd=function(e){"use strict";var t,n,r,i,s,o=this.targetElement;if(!this.trackingClick){return true}if(e.timeStamp-this.lastClickTime<this.tapDelay){this.cancelNextClick=true;return true}this.cancelNextClick=false;this.lastClickTime=e.timeStamp;n=this.trackingClickStart;this.trackingClick=false;this.trackingClickStart=0;if(deviceIsIOSWithBadTarget){s=e.changedTouches[0];o=document.elementFromPoint(s.pageX-window.pageXOffset,s.pageY-window.pageYOffset)||o;o.fastClickScrollParent=this.targetElement.fastClickScrollParent}r=o.tagName.toLowerCase();if(r==="label"){t=this.findControl(o);if(t){this.focus(o);if(deviceIsAndroid){return false}o=t}}else if(this.needsFocus(o)){if(e.timeStamp-n>100||deviceIsIOS&&window.top!==window&&r==="input"){this.targetElement=null;return false}this.focus(o);this.sendClick(o,e);if(!deviceIsIOS||r!=="select"){this.targetElement=null;e.preventDefault()}return false}if(deviceIsIOS&&!deviceIsIOS4){i=o.fastClickScrollParent;if(i&&i.fastClickLastScrollTop!==i.scrollTop){return true}}if(!this.needsClick(o)){e.preventDefault();this.sendClick(o,e)}return false};FastClick.prototype.onTouchCancel=function(){"use strict";this.trackingClick=false;this.targetElement=null};FastClick.prototype.onMouse=function(e){"use strict";if(!this.targetElement){return true}if(e.forwardedTouchEvent){return true}if(!e.cancelable){return true}if(!this.needsClick(this.targetElement)||this.cancelNextClick){if(e.stopImmediatePropagation){e.stopImmediatePropagation()}else{e.propagationStopped=true}e.stopPropagation();e.preventDefault();return false}return true};FastClick.prototype.onClick=function(e){"use strict";var t;if(this.trackingClick){this.targetElement=null;this.trackingClick=false;return true}if(e.target.type==="submit"&&e.detail===0){return true}t=this.onMouse(e);if(!t){this.targetElement=null}return t};FastClick.prototype.destroy=function(){"use strict";var e=this.layer;if(deviceIsAndroid){e.removeEventListener("mouseover",this.onMouse,true);e.removeEventListener("mousedown",this.onMouse,true);e.removeEventListener("mouseup",this.onMouse,true)}e.removeEventListener("click",this.onClick,true);e.removeEventListener("touchstart",this.onTouchStart,false);e.removeEventListener("touchmove",this.onTouchMove,false);e.removeEventListener("touchend",this.onTouchEnd,false);e.removeEventListener("touchcancel",this.onTouchCancel,false)};FastClick.notNeeded=function(e){"use strict";var t;var n;if(typeof window.ontouchstart==="undefined"){return true}n=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1];if(n){if(deviceIsAndroid){t=document.querySelector("meta[name=viewport]");if(t){if(t.content.indexOf("user-scalable=no")!==-1){return true}if(n>31&&document.documentElement.scrollWidth<=window.outerWidth){return true}}}else{return true}}if(e.style.msTouchAction==="none"){return true}return false};FastClick.attach=function(e,t){"use strict";return new FastClick(e,t)};if(typeof define=="function"&&typeof define.amd=="object"&&define.amd){define(function(){"use strict";return FastClick})}else if(typeof module!=="undefined"&&module.exports){module.exports=FastClick.attach;module.exports.FastClick=FastClick}else{window.FastClick=FastClick}


(function(window, document, $){
    "use strict";

    var classListEnabled = typeof(document.createElement('div').classList) === 'undefined' ? false : true;

    $.fn.extend({
        betterAddClass : function( className ){
            if( typeof(className) !== 'string' || !classListEnabled ){
                return this.addClass( className );
            }

            var class_arr = className.split(' ');

            return this.each(function(i,e){
                class_arr.forEach(function(c){
                    if( !e.classList.contains(c) ){ e.classList.add(c); }
                });
            });
        },
        betterRemoveClass : function( className ){
            if( typeof(className) !== 'string' || !classListEnabled ){
                return this.removeClass( className );
            }

            var class_arr = className.split(' ');

            return this.each(function(i,e){
                class_arr.forEach(function(c){
                    if( e.classList.contains(c) ){ e.classList.remove(c); }
                });
            });
        },
        betterToggleClass : function( className ){
            if( typeof(className) !== 'string' || !classListEnabled ){
                return this.betterToggleClass( className );
            }

            var class_arr = className.split(' ');

            return this.each(function(i,e){
                class_arr.forEach(function(c){
                    e.classList.toggle(c);
                });
            });
        },
        betterHasClass : function( className ){
            if( typeof(className) !== 'string' || !classListEnabled ){
                return this.hasClass( className );
            }
            return this.get(0).classList.contains( className );
        }
    });

}(this, this.document, jQuery));

(function (window, document, $, undefined) {
    "use strict";
    
    var $window = $(window),
        $document = $(document);
    
    function getInternetExplorerVersion() {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer') {
            var ua = navigator.userAgent;
            var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        return rv;
    }
    // detecta IE10+ a través de la deteccion de los eventos pointers
    Modernizr.addTest('mspointers', function () { return window.navigator.msPointerEnabled; });
    // detecta IE9- a través del parseo del useragent
    Modernizr.addTest('oldie', function () {
        var v = getInternetExplorerVersion();
        return v <= 9 && v > -1 ;
    });
    
    // PLUGINS
    $.fn.equalizeHeights = function () {
        var $items = $(this),
            heightArray = [];
        if( !$items.length ){ return; }
        $items.height('auto');
        $items.each(function(index, elem){ heightArray.push( $(elem).height() ); });
        $items.height( Math.max.apply( Math, heightArray ) ); 
        return this;
    };
    
    window.SODIMAChandler = function(){
       
    };
    window.SODIMAChandler.prototype = {

        //INICIALIZADORAS
        onReadySetup : function() {
            this.$body = $('body');
            this.relativeURL = this.$body.attr('data-relativeURL');

            var self = this;

            FastClick.attach(document.body);
            self.loadScripts();
            self.eventsHandler( $('[data-func]') );
            self.analyticsHandler( $('.trackevent-evt') );

            if( ! Modernizr.svg ) { self.svgFallback( $('[data-svgfallback]') ); }

            
        },
        onLoadSetup : function(){

        },

        onScrollSetup : function(){

        },
        onResizeSetup : function(){

        },
        loadScripts : function(){
            var self = this;
            Modernizr.load([
                {
                    test: $('.slider').length,
                    yep: self.relativeURL +'js/ninjaSlider.js',
                    callback: function(url, result, key){
                        if(result){ self.setupSliders();}
                    }
                },
                {
                    test: $('.owl-demo').length,
                    yep: self.relativeURL +'js/owl-carrousel.js',
                    callback : function(url, result, key){
                        if(result){ self.setupOwl();}
                    }
                },
                {
                    test: $('.validate-form').length,
                    yep: self.relativeURL +'js/validizr.js',
                    callback : function(url, result, key){
                       if(result){  self.setValidizr(); }
                    }
                }
            ]);

        },
        setupSliders : function(){
            var self = this,
                $content_sliders = $('.slider'),
                automatic = $content_sliders.attr('data-auto') ? $content_sliders.attr('data-auto') : false;

            if($content_sliders.length == 0){return;}

            $content_sliders.ninjaSlider({
                auto : automatic,
                transitionCallback : function( index, slide, container ){
                    var $slider = $(container),
                        $bullets = $slider.find('.slide-control'),
                        $numbers = $slider.prev().find('.change-number');

                    $bullets.betterRemoveClass('active').filter('[data-slide="'+ index +'"]').betterAddClass('active');
                    $numbers.text(index + 1);
                }
            });
            
            //se setean los controladores para 
             $content_sliders.parent().find('.control-arrow').on('click', function( event ) {
                var $item = $(event.currentTarget),
                    activeSlideNum = $content_sliders.find('.slide-control.active').data('slide'),
                    direction = $item.betterHasClass('next'),
                    totalSlidesIndex = $content_sliders.find('.content-slider-items').children().length - 1,
                    ninjaSliderObj = $content_sliders.data('ninjaSlider'),
                    targetSlidenum;

                if( direction ){
                    targetSlidenum = (activeSlideNum + 1) > totalSlidesIndex ? 0 : (activeSlideNum + 1);
                } else {
                    targetSlidenum = (activeSlideNum - 1) < 0 ? totalSlidesIndex : (activeSlideNum - 1);
                }

                ninjaSliderObj.slide(targetSlidenum);
            });
            // se setean los controles para cada slider
            $content_sliders.each(function(i, e){
                var $slider = $(e),
                    totalSlidesIndex = $slider.find('.content-slider-items').children().length - 1,
                    ninjaSliderObj = $slider.data('ninjaSlider');

                $slider.find('.slide-control').on('click', function( event ) {
                    var $item = $(event.currentTarget),
                        targetSlidenum = $item.data('slide');

                    ninjaSliderObj.slide(targetSlidenum);
                });
            });
        },
        setupOwl : function(){
            var self = this;
            var $container =  $(".owl-demo");
            var count = $container.data('count');
            var items = count ? count : 4;
            $(".owl-demo").owlCarousel({
                  items : items
              });
        }, 
        setValidizr : function (){
            var self = this,
                general_valid_action = function ( $input ){
                    $input.prev().find('.error-message').remove();
                },
                general_invalid_action = function ( $input ){
                    var customMessage = $input.attr('data-customMessage') ? $input.attr('data-customMessage') : 'Ingrese un valor válido' ;
                    $input.prev().find('.error-message').remove();
                    $input.prev().append('<span class="error-message">'+ customMessage +'</span>');
                };
            $('[data-formtype="general"]').validizr({
                delegate_keyup : false,
                notValidInputCallback : general_invalid_action,
                validInputCallback : general_valid_action
            });
        },
        eventsHandler : function( $elements ){
            if( ! $elements.length ){ return; }
            var self = this;
            $.each( $elements, function( index, elem ){
                var $item = $(elem),
                    func = $item.data('func'),
                    events = $item.data('event') ? $item.data('event') : 'click.SODIMAChandler';
                if( func && typeof( self[func] ) === 'function' ){
                    $item.on( events, $.proxy( self[ func ], self ) );
                    $item.data('delegated', true);
                } 
            });
    	},
        analyticsHandler : function($items){
            if( ! $items.length){ //Si no encuentra elementos, entonces no hace nada
                return;
            }

            $.each($items,function(index,item) {
                var $element = $(item);
                if($element.data('show')){
                    ga($element.attr('data-ga-category'), $element.attr('data-ga-event'), $element.attr('data-ga-action'), $element.attr('data-ga-label'));
                }else{
                    var events = $element.data('event') ? $element.data('event') : 'click.EDtracker';
                    $element.on(events,function( event ){
                        if( event.isTrigger && !$element.data('forcegac') ){ return true; }
                            ga($element.attr('data-ga-category'), $element.attr('data-ga-event'), $element.attr('data-ga-action'), $element.attr('data-ga-label'));
                    });
                }
            });
        },
        svgFallback : function( $elements ){
            if( ! $elements.length ){ return; }
            var $item;

            $elements.each(function(index, elem){
                $item = $(elem);
                $item.attr('src', $item.data('svgfallback'));
            });
        }
    };
    
    //COMIENZO
    
    var SODIMAC = new window.SODIMAChandler();
    $document.ready(function(){SODIMAC.onReadySetup();});
    $window.load(function(){ SODIMAC.onLoadSetup(); });
    $window.on({
        'scroll' : function(){SODIMAC.onScrollSetup()},
        'resize' : function(){SODIMAC.onResizeSetup()}
    });
    
    
        
} (this, document, jQuery));