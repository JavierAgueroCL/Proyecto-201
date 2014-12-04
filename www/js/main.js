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
        scripts_path = '/js/libs/',
        mobile_mq = 'only screen and (max-width: 999px)',
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
        deploy_submenu_cont : function( event ){
            event.preventDefault();

            var $item = $(event.currentTarget);
            $item.siblings().removeClass('deployed');
            if(event.type == 'mouseenter'){
                $item.addClass('deployed');
            }else{
                $item.removeClass('deployed');
            }
            
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
            var $item = $(event.currentTarget);

            if( ($item.data('modifier') === 'only-mobile' && Modernizr.mq( mobile_mq )) || !$item.data('modifier') ){
                event.preventDefault();
            }

            $item.toggleClass('deployed');
            $item.parent().toggleClass('deployed');
        },
        deploy_cart_adicional : function( event ){
            var $item = $(event.currentTarget);
            $item.parents('.cart-item-promos-holder').toggleClass('visible');
        },
        deploy_cart_adicional_remove : function( event ){
            var $item = $(event.currentTarget);
            $item.parents('.cart-item-promos-holder').removeClass('visible');
        },


        deploy_details_tooltip : function( event ){
            if( Modernizr.mq( mobile_mq ) ){ return; }
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

            if( $container.hasClass('deployed') ){
                $container.toggleClass('deployed');
            } else {
                $header.find('.deployed').removeClass('deployed');
                $container.toggleClass('deployed');
            }
        },
        deploy_big_header_box : function( event ){
            event.preventDefault();
            $(this).parent().toggleClass('deployed');
        },
        deploy_sub_header_box : function( event ){
            event.preventDefault();
            $(this).parent().toggleClass('deployed');
            $(this).parent().find('.sub-header-box-body').toggleClass('deployed');
        },
        delete_cart_item : function( event ){
            event.preventDefault();
            var $item = $(event.currentTarget);

            if( confirm("¿Estas seguro que deseas elimininar este item del carro de compras?") ){
                $item.parents('[data-role="item"]').first().addClass('disappearing').slideUp(700, function(){
                    $(this).remove();
                });
            }
        },
        delete_parent_item : function( event ){
            event.preventDefault();
            var $item = $(event.currentTarget);

            if( confirm("¿Estas seguro que deseas elimininar este carro?") ){
                $item.parents('[data-role="item"]').first().addClass('esconder').slideUp(700, function(){
                    $(this).remove();
                });
            }
        },
        delete_direccion : function( event ){
            event.preventDefault();
            var $item = $(event.currentTarget);

            if( confirm("¿Estas seguro que desea eliminar la dirección?") ){
                $item.parents('[data-role="item"]').first().addClass('esconder').slideUp(700, function(){
                    $(this).remove();
                });
            }
        },
        delete_purchase : function( event ){
            event.preventDefault();
            var $item = $(event.currentTarget);

            if( confirm("¿Estas seguro que desea eliminar la compra registrada?") ){
                $item.parents('[data-role="item"]').first().addClass('esconder').slideUp(700, function(){
                    $(this).remove();
                });
            }
        },
        delete_cart_list : function( event ){
            event.preventDefault();
            var $item = $(event.currentTarget);

            if( confirm("¿Estas seguro que desea eliminar el producto de su lista?") ){
                $item.parents('[data-role="item"]').first().addClass('disappearing').slideUp(700, function(){
                    $(this).remove();
                });
            }
        },
        delete_list_prod : function( event ){
            event.preventDefault();
            var $item = $(event.currentTarget);

            if( confirm("¿Estas seguro que desea eliminar su lista de productos?") ){
                $item.parents('[data-role="item"]').first().addClass('disappearing').slideUp(700, function(){
                    $(this).remove();
                });
            }
        },
        delete_cotizacion : function( event ){
            event.preventDefault();
            var $item = $(event.currentTarget);

            if( confirm("¿Estas seguro que desea eliminar la cotizacion?") ){
                $item.parents('[data-role="item"]').first().addClass('disappearing').slideUp(700, function(){
                    $(this).remove();
                });
            }
        },
        delete_direccion_get_tittle : function( event ){
            event.preventDefault();
            var $item = $(event.currentTarget);

            if( confirm($(event.currentTarget).attr("title")) ){
                $item.parents('[data-role="item"]').first().addClass('esconder').slideUp(700, function(){
                    $(this).remove();
                });
            }
        },
        scroll_to_top : function( event ){
            event.preventDefault();
            $('html, body').animate({ scrollTop : 0 }, 700);
        },
        scroll_to_target : function( event ){
            var $target = $( document.querySelector('#' + $(this).data('target')) );
            event.preventDefault();
            $('html, body').animate({ 
                scrollTop : $target.offset().top - $(this).height()
            }, 700);
        },
        reset_target_input : function( event ){
            event.preventDefault();
            $( $(this).data('target') ).val('');
        },
        show_payment_tab : function( event ){
            var $item = $(this),
                $targets = $('.payment-methods-tab-item'),
                target;

            if( $item.is('select') ){
                target = $item.find('option:selected').data('target');
            } else {
                target = $item.data('target');
            }

            $item.parents('.desktop-tabs-controls').find('.active').removeClass('active');
            $targets.removeClass('active');

            $item.parent().addClass('active');
            $targets.filter('[data-tabname="'+ target +'"]').addClass('active');
        },
        remove_from_compare_table : function( event ){
            event.preventDefault();
            var $item = $(this),
                column_index = $item.parents('tr').find('td').index( $item.parents('td').first() );
            $item
                .parents('table')
                .first()
                .find('td:nth-child('+ (column_index + 1) +')')
                .animate({
                    opacity : 0
                }, 500).promise()
                .then(function(){
                    $(this).remove();
                });
        },
        add_to_compare_table : function( event ){
            var $item = $(this),
                $input = $item.find('input'),
                $label_text = $item.find('.inline-checkbox-text:not(.comparation-link)'),
                $compare_text = $('<span class="inline-checkbox-text comparation-link">Ver</span>');

            if( $input.is(':checked') ){

                $compare_text.on('click', { sodimac : event.data.sodimac }, sodimac_delegations.get_compare_lightbox);

                $label_text.animate({ opacity: 0 }, 500).promise().then(function(){
                    $label_text.css({ display : 'none' });
                    $item.append( $compare_text );
                });
            }
            else {
                $item.find('.inline-checkbox-text.comparation-link').animate({ opacity: 0 }, 500).promise().then(function(){
                    $label_text.css({ display : 'inline-block', opacity: 1 });
                    $(this).remove();
                });
            }
        },
        get_compare_lightbox : function( event ){
            event.preventDefault();
            event.stopPropagation();

            // inicializamos el lightbox
            var lightbox_promise = event.data.sodimac.setup_lightbox( 'big-lightbox' );

            // hacemos el llamado ajax para buscar el contenido del lightbox
            var ajax_data = {}, // data adcional para el ajax, necesario para produccion
                ajax_promise = $.get('modales/comparacion.html', ajax_data);

            // preparamos la respuesta para ambas promesas
            // el callback se ejecutara cuando ambas promesas se completen
            $.when( lightbox_promise, ajax_promise ).then(function( $lightbox, ajax_response ){
                var response_html = ajax_response[0];

                // se adjunta el contenido del lightbox a la caja
                $lightbox.append( response_html );

                // auto delegamos los elementos que tengan el atributo "data-func"
                event.data.sodimac.event_handler( $lightbox.find('[data-func]') );
            });
        },
        get_mini_ficha : function( event ){
            event.preventDefault();

            // promesas
            var lightbox_promise = event.data.sodimac.setup_lightbox( 'big-lightbox' );

            // hacemos el llamado ajax para buscar el contenido del lightbox
            var ajax_data = {}, // data adcional para el ajax, necesario para produccion
                ajax_promise = $.get('modales/mini-ficha.html', ajax_data);

            // preparamos la respuesta para ambas promesas
            // el callback se ejecutara cuando ambas promesas se completen
            $.when( lightbox_promise, ajax_promise ).then(function( $lightbox, ajax_response ){
                var response_html = ajax_response[0];

                // se adjunta el contenido del lightbox a la caja
                $lightbox.append( response_html );

                // se manejan las unidades discretas
                if( $lightbox.find('[data-role="product_slider"]').length ){ 
                    imagesLoaded( $lightbox.get(0), function(){
                        event.data.sodimac.product_slider( $lightbox.find('[data-role="product_slider"]') );
                    })
                    
                }

                // auto delegamos los elementos que tengan el atributo "data-func"
                event.data.sodimac.event_handler( $lightbox.find('[data-func]') );
            });
        },
        minificha_tab_control : function( event ){
            event.preventDefault();
            var $item = $(this),
                $targets = $('.minificha-tab-item');

            $targets.removeClass('active').filter('[data-tabname="'+ $item.data('target') +'"]').addClass('active');
        },
        show_lightbox : function( event ){
            var $item = $(event.currentTarget),
                type = $item.data('type'); // actuará como nombre del modal

            // inicializamos el lightbox
            var lightbox_promise = event.data.sodimac.setup_lightbox();

            // hacemos el llamado ajax para buscar el contenido del lightbox
            var ajax_data = {}, // data adcional para el ajax, necesario para produccion
                ajax_promise = $.get('modales/' + type + '.html', ajax_data);

            // preparamos la respuesta para ambas promesas
            // el callback se ejecutara cuando ambas promesas se completen
            $.when( lightbox_promise, ajax_promise ).then(function( $lightbox, ajax_response ){
                var response_html = ajax_response[0];

                // se adjunta el contenido del lightbox a la caja
                $lightbox.append( response_html );
                if( $('.lightbox-content [data-role="amount_input"]').length ){ Sodimac.prototype.amount_inputs( $('[data-role="amount_input"]') ); }

                // auto delegamos los elementos que tengan el atributo "data-func"
                event.data.sodimac.event_handler( $lightbox.find('[data-func]') );
            });
        },
        close_lightbox : function( event ){
            event.preventDefault();
            event.data.sodimac.close_lightbox();
        }
    };


    ///// creamos el constructor de la clase
    var Sodimac = function(){};

    ///// creamos el prototypo
    Sodimac.prototype = {
        on_ready : function(){
            $('[data-svg-fallback]').svgFallback();
            this.event_handler( $('[data-func]') );

            if( ! Modernizr.input.placeholder ){
                $('input, textarea').placeholder();
            }
        },
        on_load : function(){
            if( $('[data-role="slider"]').length ){ this.home_slider( $('[data-role="slider"]') ); }
            if( $('[data-role="amount_input"]').length ){ this.amount_inputs( $('[data-role="amount_input"]') ); }
            if( $('[data-role="product_slider"]').length ){ this.product_slider( $('[data-role="product_slider"]') ); }
            if( $('[data-role="dynamic_fixed"]').length ){ this.dynamic_fixed( $('[data-role="dynamic_fixed"]') ); }
            if( $('[data-role="carousel_holder"]').length ){ this.product_carousel( $('[data-role="carousel_holder"]') ); }
            if( $('[data-role="get_calendar"]').length ){ this.datepickers( $('[data-role="get_calendar"]') ); }
            if( $('[data-validation="auto"]').length ){ this.handle_forms( $('[data-validation="auto"]') ); }

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
        setup_lightbox : function( additional_classes ){
            // se crea la promesa
            var promise = new $.Deferred();

            // se crea la estructura exterior del lightbox
            var $background = $('<div />').attr({
                    'id' : 'lightbox',
                    'class' : 'lightbox-background'
                }).css({
                    'height' : $document.height()
                });

            // se crea el contenedor del cuerpo del lightbox
            var $content = $('<div />').attr({
                    'id' : 'lightbox-content',
                    'class' : 'lightbox-content'
                });

            // se crea el boton y se delega el cierre del lightbox
            var $close_btn = $('<button />').attr({
                    'class' : 'button lightbox-close-btn'
                }).on('click.sodimac_lightbox', { sodimac : this }, function( e ){
                    e.preventDefault();
                    e.data.sodimac.close_lightbox();
                }).append('<i class="fa fa-close" ></i>');

            // se anexa el boton en el contenido del lightbox
            $content.append( $close_btn );

            /// si existen clases modificadores se le aplican
            if( additional_classes ){
                $content.addClass( additional_classes );
            }

            // guardamos la posicion del scroll para poder volver a ella cuando se cierre el lightbox
            this.scrollPos = $window.scrollTop();

            // cerramos los lightbox que puedan estar abiertos
            // usamos el API de $.deferred para esperar a que se termine la animacion
            this.close_lightbox( true ).then(function(){
                // se hace scroll hacia el top para mostrar el lightbox
                $('html, body').animate({ scrollTop: 0 }, 700);

                // se inserta el lightbox y se hace aparecer
                $background.appendTo('body').animate({ opacity: 1 }, 700, function(){
                    // cuando la animacion termina, insertamos el contnido del lightbox y resolvemos la promesa
                    $background.append( $content );
                    promise.resolve( $content );
                });
            });

            return promise;
        },
        close_lightbox : function( no_scroll ){
            // se devuelve el scroll a su posicion original
            if( ! no_scroll ){
                $('html, body').animate({ scrollTop: this.scrollPos }, 700);
            }

            // se hace desaparecer el lightbox
            if( $('#lightbox').length ){
                return $('#lightbox').animate({ opacity: 0 }, 700).promise().then(function(){
                    $('#lightbox').remove();
                });
            }
            
            return new $.Deferred().resolve();
        },

        ///
        ///
        ///
        /////// modulos discretos

        /// controlador slider home
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

        /// controlador de inputs de cantidad
        amount_inputs : function( $elements ){
            $elements.each(function(){
                var $container = $(this),
                    $input = $container.find('[data-role="amount"]'),
                    $controls = $container.find('[data-role="control"]');

                if( !$input.val() ){ $input.val(0); }

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
        },

        /// controlador de modilos carousel
        product_carousel : function( $elements ){
            $elements.each(function(){
                var $box = $(this),
                    carousel_options = {
                        items : 5,
                        itemsTablet : [999, 2],
                        itemsMobile : [999, 2],
                        pagination : $box.data('controls') === 'bullets' ? true : false,
                        slideSpeed : 500,
                        scrollPerPage : true
                    };

                var carousel = $box.find('[data-role="carousel"]').owlCarousel( carousel_options ).data('owlCarousel');

                $box.equalizeChildrenHeights(true, 'only screen and (max-width: 999px)');

                $box.find('[data-role="carousel_control"]').on('click.carousel_controls', function(event){
                    event.preventDefault();

                    if( $(this).data('action') === 'prev' ){ carousel.prev(); }
                    else { carousel.next(); }
                });
            });
        },

        /// controlador del slider de la ficha producto
        product_slider : function( $elements ){
            $elements.each(function(){
                var $slider = $(this),
                    $slides = $slider.find('[data-role="slide"]'),
                    $controls = $slider.find('[data-role="control"]'),
                    $mobile_controls = $slider.find('[data-role="mobile_control"]'),
                    $ctrls;

                $slides.equalizeHeights( true, false, function( $set, max_height ){
                    $slides.parent().height( max_height ).addClass('loaded');
                });

                $controls.each(function( i, el ){
                    $(el).attr('data-index', i).data('index', i);
                    $mobile_controls.eq( i ).attr('data-index', i).data('index', i);
                    $slides.eq( i ).attr('data-index', i).data('index', i);
                });

                $ctrls = $controls.add( $mobile_controls );

                $ctrls.on('click.product_slider', function( event ){
                    event.preventDefault();

                    $slides.removeClass('active');
                    $ctrls.removeClass('active');

                    $ctrls.filter('[data-index="'+ $(this).data('index') +'"]').addClass('active');
                    $slides.eq( $(this).data('index') ).addClass('active');
                });
            });
        },

        /// controlador de elementos sticky
        dynamic_fixed : function( $elements ){
            $elements.each(function( i, el ){
                var $box = $(el),
                    $container = $box.parent(),
                    element_offset = $box.offset().top;

                /// se crea un handler al scroll para cada elemento
                $window.on('scroll.dynamic_fixed', function(){
                    var scroll_pos = $window.scrollTop();

                    if( (scroll_pos >= element_offset) && !$box.hasClass('fixed-box')){
                        $container.height( $container.height() );
                        $box.addClass('fixed-box');
                    }
                    else if( scroll_pos < element_offset ){
                        $box.removeClass('fixed-box');
                        $container.height('auto');
                    }
                });

            });
        },

        /// Controlador de los datepickers
        datepickers : function( $elements ){
            $elements.each(function(){
                var $item = $(this);

                $item.pickadate({
                    monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                    weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                    weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
                    labelMonthNext: 'Próximo mes',
                    labelMonthPrev: 'Mes anterior',
                    labelMonthSelect: 'Selecciona un Mes',
                    labelYearSelect: 'Selecciona un año',
                    today: 'Hoy',
                    clear: 'Borrar',
                    close: 'Cerrar',
                    format: 'dd-mm-yyyy',
                    from: new Date(),
                    onSet : function( context ){
                        if( $item.data('target') ){
                            $( $item.data('target') ).val( this.get('select', 'dd-mm-yyyy') );
                        }
                    }
                });
            });
        },

        // controlador de formularios
        handle_forms : function( $elements ){
            $elements.validizr({
                delegate_keyup : false,
                // notValidFormCallBack : undefined,
                validInputCallback : function( $input ){
                    var $inputsHermanos = $input.parents('.regular-content').find('input, select');
                    var $container = $input.parents('.regular-content').find('.regular-content-tittle');
                    var errorMessage =  $container.find('.error');
                    var flag = true;

                    $.each($inputsHermanos, function(index, element){
                        var $element = $(element);
                        if($element.hasClass('invalid-input')){
                            flag = false;
                        }

                    });

                    if(flag === true){
                        errorMessage.remove();
                    }
                    
                    
                },
                notValidInputCallback : function( $input ){
                    var $container = $input.parents('.regular-content').find('.regular-content-tittle');
                    var errorMessage =  $container.find('.error');
                    var message = $input.data('custom-message') ? $input.data('custom-message') : 'Este campo es obligatorio';

                    errorMessage.remove();
                    $container.append('<span class="error" data-custom-message="'+ message +'"><i class="fa fa-exclamation-triangle only-on-mobile"></i><span class=only-on-desktop">'+ message +'</span></span>');
                },
                customValidation : {
                    password_check : function( $input ){
                        var $group = $('input[data-group="'+ $input.data('group') +'"]'),
                            value = $input.val();
                        if( ! value ){ return false; }
                        var valid = true;
                        $group.each(function(i, e){
                            if( $(e).val() !== value ){ valid = false; }
                        });
                        return valid;
                    }
                }
            });
        }
    };



    ///// inicializamos en multiples etapas:
    // al cargar el script
    var sodimac_app = new Sodimac();

    // al terminar de parsear
    $(function(){ sodimac_app.on_ready(); });

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


//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
//////////////////
////////////////// Polyfill de la consola
function log( stuff ){
    if( window.console && console.log ){
        console.log( stuff );
    }
}


//// plugin para detectar la carga de todas las imagenes
/*!
 * imagesLoaded PACKAGED v3.1.8
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

(function(){function e(){}function t(e,t){for(var n=e.length;n--;)if(e[n].listener===t)return n;return-1}function n(e){return function(){return this[e].apply(this,arguments)}}var i=e.prototype,r=this,o=r.EventEmitter;i.getListeners=function(e){var t,n,i=this._getEvents();if("object"==typeof e){t={};for(n in i)i.hasOwnProperty(n)&&e.test(n)&&(t[n]=i[n])}else t=i[e]||(i[e]=[]);return t},i.flattenListeners=function(e){var t,n=[];for(t=0;e.length>t;t+=1)n.push(e[t].listener);return n},i.getListenersAsObject=function(e){var t,n=this.getListeners(e);return n instanceof Array&&(t={},t[e]=n),t||n},i.addListener=function(e,n){var i,r=this.getListenersAsObject(e),o="object"==typeof n;for(i in r)r.hasOwnProperty(i)&&-1===t(r[i],n)&&r[i].push(o?n:{listener:n,once:!1});return this},i.on=n("addListener"),i.addOnceListener=function(e,t){return this.addListener(e,{listener:t,once:!0})},i.once=n("addOnceListener"),i.defineEvent=function(e){return this.getListeners(e),this},i.defineEvents=function(e){for(var t=0;e.length>t;t+=1)this.defineEvent(e[t]);return this},i.removeListener=function(e,n){var i,r,o=this.getListenersAsObject(e);for(r in o)o.hasOwnProperty(r)&&(i=t(o[r],n),-1!==i&&o[r].splice(i,1));return this},i.off=n("removeListener"),i.addListeners=function(e,t){return this.manipulateListeners(!1,e,t)},i.removeListeners=function(e,t){return this.manipulateListeners(!0,e,t)},i.manipulateListeners=function(e,t,n){var i,r,o=e?this.removeListener:this.addListener,s=e?this.removeListeners:this.addListeners;if("object"!=typeof t||t instanceof RegExp)for(i=n.length;i--;)o.call(this,t,n[i]);else for(i in t)t.hasOwnProperty(i)&&(r=t[i])&&("function"==typeof r?o.call(this,i,r):s.call(this,i,r));return this},i.removeEvent=function(e){var t,n=typeof e,i=this._getEvents();if("string"===n)delete i[e];else if("object"===n)for(t in i)i.hasOwnProperty(t)&&e.test(t)&&delete i[t];else delete this._events;return this},i.removeAllListeners=n("removeEvent"),i.emitEvent=function(e,t){var n,i,r,o,s=this.getListenersAsObject(e);for(r in s)if(s.hasOwnProperty(r))for(i=s[r].length;i--;)n=s[r][i],n.once===!0&&this.removeListener(e,n.listener),o=n.listener.apply(this,t||[]),o===this._getOnceReturnValue()&&this.removeListener(e,n.listener);return this},i.trigger=n("emitEvent"),i.emit=function(e){var t=Array.prototype.slice.call(arguments,1);return this.emitEvent(e,t)},i.setOnceReturnValue=function(e){return this._onceReturnValue=e,this},i._getOnceReturnValue=function(){return this.hasOwnProperty("_onceReturnValue")?this._onceReturnValue:!0},i._getEvents=function(){return this._events||(this._events={})},e.noConflict=function(){return r.EventEmitter=o,e},"function"==typeof define&&define.amd?define("eventEmitter/EventEmitter",[],function(){return e}):"object"==typeof module&&module.exports?module.exports=e:this.EventEmitter=e}).call(this),function(e){function t(t){var n=e.event;return n.target=n.target||n.srcElement||t,n}var n=document.documentElement,i=function(){};n.addEventListener?i=function(e,t,n){e.addEventListener(t,n,!1)}:n.attachEvent&&(i=function(e,n,i){e[n+i]=i.handleEvent?function(){var n=t(e);i.handleEvent.call(i,n)}:function(){var n=t(e);i.call(e,n)},e.attachEvent("on"+n,e[n+i])});var r=function(){};n.removeEventListener?r=function(e,t,n){e.removeEventListener(t,n,!1)}:n.detachEvent&&(r=function(e,t,n){e.detachEvent("on"+t,e[t+n]);try{delete e[t+n]}catch(i){e[t+n]=void 0}});var o={bind:i,unbind:r};"function"==typeof define&&define.amd?define("eventie/eventie",o):e.eventie=o}(this),function(e,t){"function"==typeof define&&define.amd?define(["eventEmitter/EventEmitter","eventie/eventie"],function(n,i){return t(e,n,i)}):"object"==typeof exports?module.exports=t(e,require("wolfy87-eventemitter"),require("eventie")):e.imagesLoaded=t(e,e.EventEmitter,e.eventie)}(window,function(e,t,n){function i(e,t){for(var n in t)e[n]=t[n];return e}function r(e){return"[object Array]"===d.call(e)}function o(e){var t=[];if(r(e))t=e;else if("number"==typeof e.length)for(var n=0,i=e.length;i>n;n++)t.push(e[n]);else t.push(e);return t}function s(e,t,n){if(!(this instanceof s))return new s(e,t);"string"==typeof e&&(e=document.querySelectorAll(e)),this.elements=o(e),this.options=i({},this.options),"function"==typeof t?n=t:i(this.options,t),n&&this.on("always",n),this.getImages(),a&&(this.jqDeferred=new a.Deferred);var r=this;setTimeout(function(){r.check()})}function f(e){this.img=e}function c(e){this.src=e,v[e]=this}var a=e.jQuery,u=e.console,h=u!==void 0,d=Object.prototype.toString;s.prototype=new t,s.prototype.options={},s.prototype.getImages=function(){this.images=[];for(var e=0,t=this.elements.length;t>e;e++){var n=this.elements[e];"IMG"===n.nodeName&&this.addImage(n);var i=n.nodeType;if(i&&(1===i||9===i||11===i))for(var r=n.querySelectorAll("img"),o=0,s=r.length;s>o;o++){var f=r[o];this.addImage(f)}}},s.prototype.addImage=function(e){var t=new f(e);this.images.push(t)},s.prototype.check=function(){function e(e,r){return t.options.debug&&h&&u.log("confirm",e,r),t.progress(e),n++,n===i&&t.complete(),!0}var t=this,n=0,i=this.images.length;if(this.hasAnyBroken=!1,!i)return this.complete(),void 0;for(var r=0;i>r;r++){var o=this.images[r];o.on("confirm",e),o.check()}},s.prototype.progress=function(e){this.hasAnyBroken=this.hasAnyBroken||!e.isLoaded;var t=this;setTimeout(function(){t.emit("progress",t,e),t.jqDeferred&&t.jqDeferred.notify&&t.jqDeferred.notify(t,e)})},s.prototype.complete=function(){var e=this.hasAnyBroken?"fail":"done";this.isComplete=!0;var t=this;setTimeout(function(){if(t.emit(e,t),t.emit("always",t),t.jqDeferred){var n=t.hasAnyBroken?"reject":"resolve";t.jqDeferred[n](t)}})},a&&(a.fn.imagesLoaded=function(e,t){var n=new s(this,e,t);return n.jqDeferred.promise(a(this))}),f.prototype=new t,f.prototype.check=function(){var e=v[this.img.src]||new c(this.img.src);if(e.isConfirmed)return this.confirm(e.isLoaded,"cached was confirmed"),void 0;if(this.img.complete&&void 0!==this.img.naturalWidth)return this.confirm(0!==this.img.naturalWidth,"naturalWidth"),void 0;var t=this;e.on("confirm",function(e,n){return t.confirm(e.isLoaded,n),!0}),e.check()},f.prototype.confirm=function(e,t){this.isLoaded=e,this.emit("confirm",this,t)};var v={};return c.prototype=new t,c.prototype.check=function(){if(!this.isChecked){var e=new Image;n.bind(e,"load",this),n.bind(e,"error",this),e.src=this.src,this.isChecked=!0}},c.prototype.handleEvent=function(e){var t="on"+e.type;this[t]&&this[t](e)},c.prototype.onload=function(e){this.confirm(!0,"onload"),this.unbindProxyEvents(e)},c.prototype.onerror=function(e){this.confirm(!1,"onerror"),this.unbindProxyEvents(e)},c.prototype.confirm=function(e,t){this.isConfirmed=!0,this.isLoaded=e,this.emit("confirm",this,t)},c.prototype.unbindProxyEvents=function(e){n.unbind(e.target,"load",this),n.unbind(e.target,"error",this)},s});


//////////////////////////////////////////////////////////////////////////////////////////////////
// validador de formularios /////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
(function($){jQuery.fn.Rut=function(options){var defaults={digito_verificador:null,on_error:function(){},on_success:function(){},validation:true,format:true,format_on:'change'};var opts=$.extend(defaults,options);return this.each(function(){if(defaults.format){jQuery(this).bind(defaults.format_on,function(){jQuery(this).val(jQuery.Rut.formatear(jQuery(this).val(),defaults.digito_verificador==null));});}if(defaults.validation){if(defaults.digito_verificador==null){jQuery(this).bind('blur',function(){var rut=jQuery(this).val();if(jQuery(this).val()!=""&&!jQuery.Rut.validar(rut)){defaults.on_error();}else if(jQuery(this).val()!=""){defaults.on_success();}});}else
{var id=jQuery(this).attr("id");jQuery(defaults.digito_verificador).bind('blur',function(){var rut=jQuery("#"+id).val()+"-"+jQuery(this).val();if(jQuery(this).val()!=""&&!jQuery.Rut.validar(rut)){defaults.on_error();}else if(jQuery(this).val()!=""){defaults.on_success();}});}}});}})(jQuery);jQuery.Rut={formatear:function(Rut,digitoVerificador){var sRut=new String(Rut);var sRutFormateado='';sRut=jQuery.Rut.quitarFormato(sRut);if(digitoVerificador){var sDV=sRut.charAt(sRut.length-1);sRut=sRut.substring(0,sRut.length-1);}while(sRut.length>3){sRutFormateado="."+sRut.substr(sRut.length-3)+sRutFormateado;sRut=sRut.substring(0,sRut.length-3);}sRutFormateado=sRut+sRutFormateado;if(sRutFormateado!=""&&digitoVerificador){sRutFormateado+="-"+sDV;}else if(digitoVerificador){sRutFormateado+=sDV;}return sRutFormateado;},quitarFormato:function(rut){var strRut=new String(rut);while(strRut.indexOf(".")!=-1){strRut=strRut.replace(".","");}while(strRut.indexOf("-")!=-1){strRut=strRut.replace("-","");}return strRut;},digitoValido:function(dv){if(dv!='0'&&dv!='1'&&dv!='2'&&dv!='3'&&dv!='4'&&dv!='5'&&dv!='6'&&dv!='7'&&dv!='8'&&dv!='9'&&dv!='k'&&dv!='K'){return false;}return true;},digitoCorrecto:function(crut){largo=crut.length;if(largo<2){return false;}if(largo>2){rut=crut.substring(0,largo-1);}else
{rut=crut.charAt(0);}dv=crut.charAt(largo-1);jQuery.Rut.digitoValido(dv);if(rut==null||dv==null){return 0;}dvr=jQuery.Rut.getDigito(rut);if(dvr!=dv.toLowerCase()){return false;}return true;},getDigito:function(rut){var dvr='0';suma=0;mul=2;for(i=rut.length-1;i>=0;i--){suma=suma+rut.charAt(i)*mul;if(mul==7){mul=2;}else
{mul++;}}res=suma%11;if(res==1){return'k';}else if(res==0){return'0';}else
{return 11-res;}},validar:function(texto){texto=jQuery.Rut.quitarFormato(texto);largo=texto.length;if(largo<2){return false;}for(i=0;i<largo;i++){if(!jQuery.Rut.digitoValido(texto.charAt(i))){return false;}}var invertido="";for(i=(largo-1),j=0;i>=0;i--,j++){invertido=invertido+texto.charAt(i);}var dtexto="";dtexto=dtexto+invertido.charAt(0);dtexto=dtexto+'-';cnt=0;for(i=1,j=2;i<largo;i++,j++){if(cnt==3){dtexto=dtexto+'.';j++;dtexto=dtexto+invertido.charAt(i);cnt=1;}else
{dtexto=dtexto+invertido.charAt(i);cnt++;}}invertido="";for(i=(dtexto.length-1),j=0;i>=0;i--,j++){invertido=invertido+dtexto.charAt(i);}if(jQuery.Rut.digitoCorrecto(texto)){return true;}return false;}};

(function(window, $){
    "use strict";

    window.Validizr = function(form, options){
        if( !form ){ return; }

        var self = this;

        self.defaults = {
            validatedInit : false, 
            delegate_change : true, // bool, controla la delegacion de la validacion en los campos
            delegate_keyup : true, // bool, controla la delegacion de la validacion en los campos
            delegate_custom : undefined, // string, controla la delegacion de la validacion en los campos

            submitBtn : undefined,
            disableBtn : false, // bool, controla si se le pone o no la prop disabled al submitBtn

            onInit : undefined,

            validFormCallback : undefined, // funcion, lleva como parametro el $formulario
            notValidFormCallBack : undefined, // funcion, lleva como parametro el $formulario

            validInputCallback : undefined, // funcion, lleva como parametro el $input
            notValidInputCallback : undefined, // funcion, lleva como parametro el $input

            preValidation : undefined, // funcion, lleva como parametro el $formulario y el $input
            postValidation : undefined, // funcion, lleva como parametro el $formulario y el $input

            notValidClass : 'invalid-input', // string, clase a aplicar a los inputs no validos
            validClass : 'valid-input', // string, clase a aplicar a los inputs no validos

            aditionalInputs : undefined, // string, selector para inputs customizados
            customValidation : {}, // objeto, prototipo para las validaciones customizadas. 

            customValidHandlers : {}, // objeto, prototipo para los exitos customizados. 
            customErrorHandlers : {}, // objeto, prototipo para los errores customizados. 

            customUrlRegexp : undefined,
            customEmailRegexp : undefined
        };
        self.settings = $.extend(true, {}, self.defaults, (options || {}));

        self.$form = $(form);
        self.fieldsSelector = 'input:not([type="submit"]), select, textarea' + ( self.settings.aditionalInputs ? ', ' + self.settings.aditionalInputs : '' );
        self.$submitBtn = typeof( self.settings.submitBtn ) === 'undefined' ? self.$form.find('[type="submit"]') : $( self.settins.submitBtn );
        self.emailRegEx = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
        self.urlRegEx = new RegExp("[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?", 'gi');

        var events = 'validate.validizr';

        if( self.settings.delegate_change ){ events += ' change.validizr'; }
        if( self.settings.delegate_keyup ){ events += ' keyup.validizr'; }
        if( self.settings.delegate_custom ){ events += ' ' + self.settings.delegate_custom; }

        if( self.settings.disableBtn ){ self.$submitBtn.addClass('disabled').prop('disabled', true); }

        self.$form
            .attr({ 'data-validizr-handled' : 'true', 'novalidate' : true })
            .on('submit.validizr', { validizr : self }, self.validateForm)
            .on( events, self.fieldsSelector, { validizr : self }, self.validateInputs);

        if( typeof( self.settings.onInit ) === 'function' ){ self.settings.onInit( self.$form, validizr ); }

        if( self.settings.validatedInit ){ validizr.$form.find( validizr.fieldsSelector ).trigger('validate.validizr'); }
    };
    window.Validizr.prototype = {
        validateInputs : function( event ){
            var validizr = event.data.validizr,
                $input = $(event.currentTarget),
                inputType = validizr.getInputType($input),
                value = $input.val(),
                customHandler = $input.data('custom-validation'),
                validInput = (function(){
                    if( ! $input.is('[required]') && ! $input.hasClass('required') ){ return true; }
                    if( !!customHandler && typeof( validizr.settings.customValidation[ customHandler ] ) === 'function' ){
                        return validizr.settings.customValidation[ customHandler ]( $input );
                    }
                    switch( inputType ){
                        case 'email' :
                            return !!value && validizr.emailRegEx.test(value);

                        // case 'url' : return !!value && validizr.urlRegEx.test(value); //desactivado hasta que funcione bien
                        
                        case 'checkbox' : 
                            return $input.prop('checked');
                        default : 
                            return !!value;
                    }
                }());

            $input.removeClass( validizr.settings.notValidClass + ' ' + validizr.settings.validClass ); 


            if( typeof(validizr.settings.preValidation) === 'function' ){ 
                validizr.settings.preValidation( validizr.$form, $input );
            }
            
            validizr.youAre( validInput, $input );

            if( typeof(validizr.settings.postValidation) === 'function' ){
                validizr.settings.postValidation( validizr.$form, $input );
            }
            
            if( validizr.settings.disableBtn ){
                validizr.$submitBtn.removeClass('disabled').prop('disabled', !validizr.isFormValid( validizr ));
            }
        },
        validateForm : function( event ){
            var validizr = event.data.validizr,
                validFlag = false;

            validizr.$form.find( validizr.fieldsSelector ).trigger('validate.validizr');

            validFlag = validizr.isFormValid();

            if( validFlag ){
                if( typeof( validizr.settings.validFormCallback ) === 'function' && !validizr.$form.data('trigger-submit') ) {
                    validizr.settings.validFormCallback( validizr.$form );
                    event.preventDefault();
                    return false;
                }
                return true;
            }
            else if( typeof( validizr.settings.notValidFormCallBack ) === 'function' ) {
                validizr.settings.notValidFormCallBack( validizr.$form );
            }

            event.preventDefault();
            return false;
        },
        isFormValid : function(){
            var validizr = this,
                $fieldsGroup = validizr.$form.find( validizr.fieldsSelector ),
                totalLength = $fieldsGroup.length,
                validLength = $fieldsGroup.filter(function(){ return $(this).data('input_validity'); }).length,
                softValidation = validizr.$form.find('.' + validizr.settings.notValidClass).length;
        
            return totalLength === validLength && !softValidation;
        },
        youAre : function(validity, $input){
            var validizr = this,
                customHandler_invalid = $input.data('custom-invalid-callback'),
                customHandler_valid = $input.data('custom-valid-callback'),
                hasGenericValidation_valid = typeof( validizr.settings.validInputCallback ) === 'function',
                hasCustomValidation_valid = typeof( validizr.settings.customValidHandlers[ customHandler_valid ] ) === 'function',
                hasGenericValidation_invalid = typeof( validizr.settings.notValidInputCallback ) === 'function',
                hasCustomValidation_invalid = typeof( validizr.settings.customErrorHandlers[ customHandler_invalid ] ) === 'function';
            
            $input.data('input_validity', validity);
            $input.attr('data-input-validity', validity);

            if( validity ){
                $input.addClass( validizr.settings.validClass );
                if( hasCustomValidation_valid ){
                    validizr.settings.customValidHandlers[ customHandler_valid ]( $input );
                    return;
                }

                if( hasGenericValidation_valid ){
                    validizr.settings.validInputCallback( $input );
                    return;
                }
            } else {
                $input.addClass( validizr.settings.notValidClass );
                if( hasCustomValidation_invalid ){
                    validizr.settings.customErrorHandlers[ customHandler_invalid ]( $input );
                    return;
                }
                if( hasGenericValidation_invalid ){
                    validizr.settings.notValidInputCallback( $input );
                    return;
                }
            }
        },
        getInputType : function( $input ){
            return $input.attr('type') ? $input.attr('type') : $input.get(0).tagName.toLowerCase();
        }
    };

    $.fn.validizr = function(options){ return this.each(function(){ $(this).data('validizr', (new window.Validizr(this, options))); }); };

}(this, jQuery));