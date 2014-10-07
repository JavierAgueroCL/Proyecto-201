//////////////////
//////////////////
//////////////////
//////////////////
////////////////// Codigo principal
(function(window, document, $){
    // modo estricto, mejora enromemente la seguridad del script.
    // compatible desde IE9+, ignorado por IE8-
    "use strict";

    var debug_mode = true,
        $window = $(window),
        $document = $(document);


    ///// creamos el objeto de delegaciones
    var sodimac_delegations = {
        deploy_submenu : function( event ){
            event.preventDefault();

            // variables generales
            var $item = $(this),
                $container = $item.parent(),
                $submenu = $container.find('.submenu'),
                submenu_width_calc;

            if( $item.attr('data-set-width') === 'true' ){
                submenu_width_calc = $('#main-nav').width() - $container.position().left;
                $submenu.width( submenu_width_calc ); 
            }

            $container.toggleClass('deployed');
        },
        deploy_mobile_menu : function( event ){
            event.preventDefault();

            var $item = $(event.currentTarget),
                $parent = $item.parent(),
                $submenu = $parent.find('.submenu'),
                $main_nav = $('#main-nav'),
                menu_width = $main_nav.innerWidth() - ( parseInt($main_nav.css('padding-left'), 10) * 2 );

            $submenu.css('width', menu_width);
            $parent.toggleClass('deployed');
        },
        deploy_mobile_submenu : function( event ){
            event.preventDefault();

            var $item = $(event.currentTarget);

            $item.toggleClass('deployed');
            $item.parent().toggleClass('deployed');
        },
        deploy_details_tooltip : function( event ){
            event.preventDefault();

            var $item = $(event.currentTarget),
                $container = $item.parent(),
                $header = $('#main-header'),
                $submenu, header_offset_right, calc;

            if( $item.attr('data-set-pos') === 'true' ){ 
                $submenu = $item.parent().find('.account-notifier-details');
                header_offset_right = $header.offset().left + $header.outerWidth();
                calc = ( $container.offset().left + $submenu.outerWidth() ) - header_offset_right;
                $submenu.css('left', calc * -1); 
            }

            $header.find('.deployed').removeClass('deployed');
            $container.toggleClass('deployed');
        }
    };


    ///// creamos el constructor de la clase
    var Sodimac = function(){};

    ///// creamos el prototypo
    Sodimac.prototype = {
        on_ready : function(){
            $('[data-svg-fallback]').svgFallback();
            this.event_handler( $('[data-func]') );
        },
        on_load : function(){
            if( $('[data-role="slider"]').length ){ this.home_slider( $('[data-role="slider"]') ); }
            if( $('[data-role="amount_input"]').length ){ this.amount_inputs( $('[data-role="amount_input"]') ); }

            $('[data-equalize="children"]').equalizeChildrenHeights(true, 'only screen and (max-width: 999px)');
        },
        event_handler : function( $collection ){
            if( ! $collection.length ){ return; }

            var sodimac = this;
            $collection.each(function(){
                var $item = $(this),
                    func = $item.data('func'),
                    events = $item.data('events') || 'click.sodimac';

                if( func && typeof( sodimac_delegations[ func ] ) === 'function' ){
                    $item.off( events, sodimac_delegations[ func ] );
                    $item.on( events, { sodimac : sodimac }, sodimac_delegations[ func ] );
                }
            });
        },

        /////// modulos discretos
        home_slider : function( $slider ){
            var $item_list = $slider.find('[data-role="slides-holder"]'),
                $items = $item_list.children(),
                $bullets_list = $slider.find('[data-role="bullets-holder"]'),
                $controls_list = $slider.find('[data-role="controls-holder"]');

            // primero equalizamos las alturas de los items y lo aplicamos a la lista contenedora
            // @todo: falta media query para moviles
            $items.equalizeHeights( true, false, function( $set, max_height ){
                $item_list.height( max_height );
            });

            // manejamos los controles y bullets del slider
            $bullets_list.on('click.sodimac_slider', 'button', function( event ){
                var $bullet = $(this),
                    target_index = $bullet.data('index');

                $items.removeClass('active').filter('[data-index="'+ target_index +'"]').addClass('active');
                $bullet.siblings().removeClass('active');
                $bullet.addClass('active');
            });

            $controls_list.on('click.sodimac_slider', 'button', function( event ){
                var $control = $(this),
                    action = $control.data('action'),
                    $target_slide;

                if( action === 'next' ){
                    $target_slide = $items.filter('.active').next().length ? $items.filter('.active').next() : $items.first();
                } else {
                    $target_slide = $items.filter('.active').prev().length ? $items.filter('.active').prev() : $items.last();
                }
                
                $items.removeClass('active');
                $target_slide.addClass('active');
                $bullets_list.children().removeClass('active');
                $bullets_list.find('[data-index="'+ $target_slide.data('index') +'"]').addClass('active');
            });

            // indicamos que el slider se cargo correctamente
            $slider.addClass('loaded');


            // seteamos un intervalo para el slider que debe desactivarse al pasar el mouse por envima de el
            var slider_interval = setInterval(function(){
                $controls_list.find('[data-action="next"]').trigger('click.sodimac_slider');
            }, 5000);

            $slider.one('mouseover touchdown pointerdown', function(){
                clearInterval( slider_interval );
            });
        },

        amount_inputs : function( $elements ){
            $elements.each(function(){
                var $container = $(this),
                    $input = $container.find('[data-role="amount"]'),
                    $controls = $container.find('[data-role="control"]');

                $controls.on('click.amount_handler', function( event ){
                    event.preventDefault();

                    var action = $(this).data('action'),
                        value = parseInt( $input.val() ) || 0;

                    if( action === 'add' ){ value += 1; }
                    else { value -= 1; }

                    if( value < 0 ){ value = 0; }

                    $input.val( value );
                });

                $input.on('change.amount_handler', function(){
                    var value = parseInt( $input.val() ) || 0;
                    if( isNaN(value) ){ value = 0; }
                    $input.val( value );
                });
            });
        }
    };



    ///// inicializamos en multiples etapas:
    // al cargar el script
    var sodimac_app = new Sodimac();

    // al terminar de parsear
    $(function(){ sodimac_app.on_ready() });

    // al terminar la carga de la pagina
    $window.load(function(){ sodimac_app.on_load(); });

}(this, this.document, this.jQuery));


//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
////////////////// Polyfill para requestAnimationFrame
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
////////////////// Plugins jQuery personaliados
(function(window, $){
    var $window = $(window);

    $.fn.svgFallback = function(){
        if( Modernizr.svg ){ return this; }
        return this.each(function(i,el){ el.setAttribute("src", el.getAttribute('data-svg-fallback')); });
    };
    $.fn.equalizeHeights = function( dinamic, mqException, callback ){
        var items = this,
            eq_h = function( $collection ){
                var heightArray = [],
                    max_height = 0;

                $collection.removeClass('height-equalized').height('auto');

                if( !mqException || !Modernizr.mq(mqException) ){
                    $collection.each(function(i,e){ heightArray.push( $(e).height() ); });

                    max_height = Math.max.apply( Math, heightArray );
                    $collection.height( max_height ).addClass('height-equalized').attr('data-max-height', max_height);

                    if( typeof(callback) === 'function' ){
                        callback( $collection, max_height );
                    }
                }
            };

        requestAnimationFrame(function(){
            eq_h( items );
        });

        if( dinamic ) { 
            $window.on('resize.equalize', function(){ 
                requestAnimationFrame(function(){
                    eq_h( items );
                });
            });
        }
    };
    $.fn.equalizeChildrenHeights = function( dinamic, mqException ){
        return this.each(function(i,e){
            $(e).children().equalizeHeights(dinamic, mqException);
        });
    };
}(this, this.jQuery));


//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
////////////////// pruebas de modernizr
(function(){
    "use strict";

    Modernizr.addTest({
        // detecta IE10+ a través de la deteccion de los eventos pointers
        'mspointers' : function () { return window.navigator.msPointerEnabled; },

        // detecta IE9- a través del parseo del user agent
        'oldie' : function () {
            var rv = -1; // Return value assumes failure.
            if (navigator.appName == 'Microsoft Internet Explorer') {
                var ua = navigator.userAgent,
                    re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");

                if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
            }
            return rv <= 9 && rv > -1 ; 
        },

        // detecta IOS
        'ios' : function () { return ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false ); },
        'iphone' : function () { return ( navigator.userAgent.match(/(iPhone)/g) ? true : false ); },

        // detecta android
        'android' : function () { return navigator.userAgent.toLowerCase().indexOf("android") > -1; }
    });
}());