(function($) {
  /**
   * Настройки по умолчанию
   */
  var defaults = {
    url: null,
    data: {},
  };

  var __;

  /**
   * Конструктор
   */
  window.CalOnline = function(el, options) {
    this.$self = el;
    this.init(options);
  };

  meth = CalOnline.prototype;

  /**
   * Инициализация
   */
  meth.init = function(options) {
    var _ = this,
      self = _.$self;

    if (_.inited === true) return;

    // Настройки: По умолчанию
    _.defaults = $.extend(true, {}, defaults, $.fn.CalOnline.defaults);
    // Настройки: Пользовательские
    _.options = options || {};
    // Настройки: Data-атрибут
    _.dataOptions = $(self).data('CalOnline') || {};
    // Настройки: Объединенные
    _.settings = $.extend(true, {}, _.defaults, _.options, _.dataOptions);

    // Событие: 'beforeInit'
    $(self).trigger('beforeInit.plgt', [_, _.settings]);

    var $self = $(self);
    var layout = (_.layout = {
      $square: $self.find('[data-calc-square]'),
      $lamps: $self.find('[data-calc-lamps]'),
      $corners: $self.find('[data-calc-corners]'),
      $material: $self.find('[data-calc-material]'),
      $result: $self.find('[data-calc-result]'),
      $calculate: $self.find('[data-calc-calculate]'),
    });

    // Data preparation
    $.each(_.settings.data, function (name, material) {
      var max, min;

      $.each(material.square, function (m, price) {
        material.square[m] = Number(material.square[m]);
      });

      max = __.getMaxOfArray(Object.keys(material.square));
      min = __.getMinOfArray(Object.keys(material.square))

      material.square.maxM = max;
      material.square.minM = min;
    });

    // Put materials to select
    layout.$material.empty();
    $.each(_.settings.data, function(matName, matData) {
      layout.$material.append(
        '<option value="' + matName + '">' + matName + '</option>'
      );
    });

    // Calculate handler
    layout.$calculate.on('click', function() {
      _.calculate();
    });

    /**
     * fields common validation
     */
    $()
      .add(layout.$square)
      .add(layout.$lamps)
      .add(layout.$corners)
      .on('keypress input', function (e) {
        var check = this.value + String.fromCharCode(e.charCode);
        var regExp = /^\d{1,4}$/;

        if (!regExp.test(check)) return false;
      });

    /**
     * Square validation
     */
    layout.$square.on('input', function (e) {
      var self = this, valTo;
      var square = _.settings.data[layout.$material.val()].square;
      var max = square.maxM;
      var min = square.minM;
      
      // Square range
      if (self.value > max) {
        valTo = max;
      } else if (self.value < min) {
        valTo = min;
      }

      // Normalize square
      if (valTo) {
        self.value = valTo;
      }
    });

    // Плгин инициализирован
    _.inited = true;

    // Событие: 'afterInit'
    $(self).trigger('afterInit.plgt', [_, _.settings]);
  };


  /**
   * Расчет
   */
  meth.calculate = function(distance, duration) {
    var _ = this,
      self = _.$self,
      sets = _.settings,
      data = sets.data,
      l = _.layout;
    
    var materialName = l.$material.find('option:selected').val();

    var squareCount = Number(l.$square.val()) || 0;
    var lampsCount = Number(l.$lamps.val()) || 0;
    var cornersCount = Number(l.$corners.val()) || 0;
    
    var squarePrice = Number(data[materialName].square[squareCount]);
    var lampsPrice = Number(data[materialName].lamps);
    var cornersPrice = Number(data[materialName].corners);

    var sum = squarePrice * squareCount + lampsPrice * lampsCount + cornersPrice * cornersCount;

    if (sum && typeof sum === 'number') {
      l.$result.text(sum + ' руб.');
    } else {
      l.$result.text('—');
    }
  };

  /**
   * Деинициализация
   */
  meth.destroy = function() {
    var _ = this,
      self = _.$self;

    if (!_.inited) return;

    // Код здесь...
    $(self).removeAttr('style');
    delete self.CalOnline;
  };

  /**
   * Реинициализация
   */
  meth.reinit = function(newSets) {
    var _ = this,
      self = _.$self,
      sets =
        typeof newSets == 'object' && Object.keys(newSets).length != 0
          ? newSets
          : $.extend(true, {}, _.settings);

    _.destroy();
    $(self).CalOnline(sets);
  };

  __ = {
    /**
     * Генерирует случайное число
     */
    getRndNum: function(min, max) {
      return Math.round(min - 0.5 + Math.random() * (max - min + 1));
    },
    getMaxOfArray: function getMaxOfArray(numArray) {
      return Math.max.apply(null, numArray);
    },
    getMinOfArray: function getMaxOfArray(numArray) {
      return Math.min.apply(null, numArray);
    }
  };

  $.fn.CalOnline = function() {
    var pn = 'CalOnline',
      args = arguments,
      mth = args[0];

    $.each(this, function(i, it) {
      if (typeof mth == 'object' || typeof mth == 'undefined')
        it[pn] = crtInst(it, mth);
      else if (mth === 'init' || mth === 'reinit')
        it[pn] ? getMeth(it, mth, args) : (it[pn] = crtInst(it, args[1]));
      else getMeth(it, mth, args);
    });

    function getMeth(it, mth, args) {
      if (!(it[pn] instanceof CalOnline)) return;
      if (!(mth in it[pn])) return;
      return it[pn][mth].apply(it[pn], Array.prototype.slice.call(args, 1));
    }

    function crtInst(it, mth) {
      if (it[pn] instanceof CalOnline) return;
      return new CalOnline(it, mth);
    }

    return this;
  };

  $.fn.CalOnline.defaults = defaults;
})(jQuery);

$(document).ready(function() {
  $('[data-calc]').CalOnline({
    url: '',
    data: {
      'Мат': {
        square: {
          1: 1590,
          2: 1680,
          3: 1770,
        },
        corners: 40,
        lamps: 250,
      },
      'Сатин': {
        square: {
          1: 1590,
          2: 1680,
          3: 1770,
        },
        corners: 40,
        lamps: 250,
      },
      'Глянец': {
        square: {
          1: 1595,
          2: 1690,
          3: 1785,
        },
        corners: 40,
        lamps: 250,
      },
    }
  });

  /**
   * Data
   */
  var data = {
    arrowLeft:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M10.707 23.707l-1.561-1.414-9.146 9v1.414l9.146 9 1.488-1.414-7.22-7.293h60.586v-2h-60.586z"/></svg>',
    arrowRight:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path d="M53.293 40.293l1.561 1.414 9.146-9v-1.414l-9.146-9-1.488 1.414 7.22 7.293h-60.586v2h60.586z"/></svg>',
  };

  /**
   * UniversalParallax
   */
  new universalParallax().init({
    speed: 2.0,
  });

  var mainTextSceen = document.getElementById('scene');
  if (mainTextSceen) new Parallax(mainTextSceen);
  // new Parallax(document.getElementById('scene-2'));

  /**
   * SVG Support fo all browser
   */
  svg4everybody();

  /**
   * CSS "object-fit" polyfill
   */
  objectFitImages();

  /**
   * Lazy
   */
  $('[data-lazy-img]').Lazy({
    effect: 'fadeIn',
    effectTime: 750,
    afterLoad: function(elem) {
      elem.css('display', '');
      elem.removeClass('lazy-preloader');
    },
  });
  $('[data-lazy-bg]').Lazy({
    effect: 'fadeIn',
    effectTime: 0,
    // afterLoad: function(e) {
    //   e.css('display', '');
    // },
  });

  /**
   * Fancybox defaults
   */
  $.fancybox.defaults = $.extend({}, $.fancybox.defaults, {
    touch: false,
    transitionEffect: 'slide',
    // animationEffect: 'zoom-in-out',
    transitionDuration: 500,
    lang: 'ru',
    i18n: {
      ru: {
        CLOSE: 'Закрыть',
        NEXT: 'Далее',
        PREV: 'Назад',
        ERROR: 'Ошибка. Содержимое не найдено.',
        PLAY_START: 'Запустить слайд-шоу',
        PLAY_STOP: 'Остановить слайд-шоу',
        FULL_SCREEN: 'На весь экран',
        THUMBS: 'Миниатюры',
        DOWNLOAD: 'Скачать',
        SHARE: 'Поделиться',
        ZOOM: 'Масштаб',
      },
    },
  });

  /**
   * Fancybox (open gallery by ID)
   * <a dataofancybox-open="<gallery-id>"></a>
   */
  $('[data-fancybox-open]').on('click', function(e) {
    var id = $(this).data('fancybox-open');

    $('[data-fancybox="' + id + '"]')
      .eq(0)
      .trigger('click');
    e.preventDefault();
  });

  /**
   * Zero pad
   */
  function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;

    return Array(+(zero > 0 && zero)).join('0') + num;
  }

  /**
   * AnimateCSS
   */
  function animateCSS(elements, animationName, duration, delay, callback) {
    var duration = duration >= 0 ? duration / 1000 : '',
      delay = delay >= 0 ? delay / 1000 : '';

    elements.addClass('animated ' + animationName).css({
      'animation-duration': duration + 's',
      'animation-delay': delay + 's',
    });

    function handleAnimationEnd() {
      elements.removeClass('animated ' + animationName).css({
        'animation-duration': '',
        'animation-delay': '',
      });
      elements.off('animationend', handleAnimationEnd);
      if (typeof callback === 'function') callback();
    }

    elements.on('animationend', handleAnimationEnd);
  }

  function animateCSSRemove(elements, animationName) {
    elements.removeClass('animated ' + animationName);
  }

  /**
   * Selects
   */
  $('select').selectric();

  /**
   * MobileMenu
   */
  var $mobileMenu = $('[data-main-menu]');
  var $mainMenuItems = $mobileMenu.find('li');

  $('.app-main-menu-hamburger').on('click', function() {
    var delay = 0;
    var $hamburger = $(this);

    $hamburger.toggleClass('is-active');
    $mobileMenu.toggleClass('active');

    if ($mobileMenu.hasClass('active')) {
      $mainMenuItems.each(function(i, li) {
        // setTimeout(function () {
        animateCSS($(li), 'slideInRight', 450, delay);
        delay += 65;
        // }, 40);
      });
    }
  });

  /**
   * SwitchMenu
   */
  // var $switchMenu = $('[data-switch-menu]');
  // var $switchMenuLinks = $switchMenu.find('a');
  // var $switchMenuLis = $switchMenu.find('li');

  // $switchMenu.each(function (i, elem) {
  //   $menu = $(elem);
  //   $lis = $menu.find('li');
  //   $links = $menu.find('a');

  //   $switchMenu.on('click', 'a', function () {
  //     var $li = $(this).parents('li');

  //     $lis.removeClass('active');
  //     $li.addClass('active');
  //   });
  // });

  /**
   * GalleryMain
   */
  var $galleryMain = $('[data-gallery-main]');

  $galleryMain.each(function(i, gallery) {
    var $gallery = $(gallery);
    var $carousel = $gallery.find('.owl-carousel');
    var $nav = $(
      '[data-gallery-main-nav="' + $gallery.data('gallery-main') + '"]'
    );
    var options = $.extend(
      {},
      {
        items: 1,
        loop: true,
        nav: true,
        dots: false,
        lazyLoad: true,
        lazyLoadEager: 1,
        animateOut: 'zoomOut',
        animateIn: 'fadeInLeft',
        smartSpeed: 450,
        navText: [
          '<button class="btn btn-circle btn-circle_accent">' +
            data.arrowLeft +
            '</button>',
          '<button class="btn btn-circle btn-circle_accent">' +
            data.arrowRight +
            '</button>',
        ],
        onInitialized: function() {
          $(this).fadeIn();
        },
        onLoadedLazy: function(e) {
          $(e.element)
            .parent()
            .removeClass('preloader-blue');
        },
      },
      $carousel.data('owl')
    );

    // Init
    $carousel.owlCarousel(options);

    // Remove all slides
    $carousel.removeAllSlides = function removeAllSlides() {
      var $carousel = $(this);
      var $items = $carousel.find('.owl-item:not(.cloned)');

      $items.each(function(i, item) {
        $carousel.trigger('remove.owl.carousel', i);
      });

      return this;
    };

    // Add slides from array ou urls
    $carousel.addSlides = function removeAllSlides(urls) {
      var $carousel = $(this);

      urls = urls || [];

      urls.forEach(function(url) {
        $carousel.trigger(
          'add.owl.carousel',
          '<div class="gallery-main__item">' +
            '<div class="gallery-main__item-wrap preloader-blue">' +
            '<img class="gallery-main__img owl-lazy" data-src="' +
            url +
            '" alt="photo">' +
            '</div>' +
            '</div>'
        );
      });

      return this;
    };

    // Gallery menu on click
    $nav.on('click', 'a', function(e) {
      var $link = $(this);
      var $li = $link.parents('li').eq(0);

      $nav.find('li').removeClass('active');
      $li.addClass('active');

      $carousel
        .removeAllSlides()
        .addSlides($(this).data('images'))
        .trigger('destroy.owl.carousel')
        .owlCarousel(options);

      e.preventDefault();
    });

    // Load Active item
    $nav
      .find('li.active a')
      .eq(0)
      .trigger('click');
  });

  /**
   * SliderReviews
   */
  var $sliderReviews = $('[data-slider-reviews]');

  var getCurrentIndex = function(e) {
    if (e.item) {
      var index = e.item.index - 1;
      var count = e.item.count;
      if (index > count) {
        index -= count;
      }
      if (index <= 0) {
        index += count;
      }
      return index;
    }
  };

  $sliderReviews.each(function(i, slider) {
    var $slider = $(slider);
    var id = $slider.data('slider-reviews');
    var $sliderPhotos = $slider.find(
      '[data-slider-reviews-photos="' + id + '"]'
    );
    var $sliderTexts = $slider.find('[data-slider-reviews-texts="' + id + '"]');
    var $sliderControls = $slider.find(
      '[data-slider-reviews-controls="' + id + '"]'
    );
    var $sliderPrev = $sliderControls.find('[data-prev]');
    var $sliderNext = $sliderControls.find('[data-next]');
    var $sliderCounterAll = $sliderControls.find('[data-all]');
    var $sliderCounterCurrent = $sliderControls.find('[data-current]');
    var $sliderSubstrate = $slider.find(
      '[data-slider-reviews-substrate="' + id + '"]'
    );

    $sliderTexts.on('initialized.owl.carousel', function(e) {
      // Current index on init
      $sliderCounterCurrent.html(zeroPad(getCurrentIndex(e), 2));
      // All slides on init
      $sliderCounterAll.html(zeroPad(e.item.count, 2));
    });

    $sliderPhotos.on('changed.owl.carousel', function(e) {
      var $img = $sliderSubstrate.find('img');

      // Substrate
      setTimeout(function() {
        var src = $(e.target)
          .find('.owl-item.active img')
          .attr('src');

        animateCSS($img, 'fadeOut', 1, 0, function() {
          $img.attr('src', src);
          animateCSS($img, 'zoomIn', 900, 0);
        });
      }, 0);
    });

    $sliderTexts.on('changed.owl.carousel', function(e) {
      // Sync sliders
      if (e.namespace && e.property.name === 'position') {
        var target = e.relatedTarget.relative(e.property.value, true);
        $sliderPhotos.owlCarousel('to', target);
      }
      // Current index on change
      $sliderCounterCurrent.html(zeroPad(getCurrentIndex(e), 2));
    });

    // Init sliders
    $sliderPhotos.owlCarousel(
      $.extend(
        {},
        {
          // Default options
          items: 1,
          dots: false,
          loop: true,
          lazyLoad: true,
          lazyLoadEager: 1,
          mouseDrag: false,
          touchDrag: false,
          pullDrag: false,
          freeDrag: false,

          animateOut: 'fadeOut',
          animateIn: 'fadeIn',
          smartSpeed: 450,
        },
        $sliderPhotos.data('owl') || {}
      )
    );

    $sliderTexts.owlCarousel(
      $.extend(
        {},
        {
          // Default options
          items: 1,
          dots: false,
          loop: true,
          autoHeight: true,
          smartSpeed: 450,
          animateOut: 'zoomOut',
          animateIn: 'fadeInLeft',
        },
        $sliderTexts.data('owl') || {}
      )
    );

    // Next custom button
    $sliderNext.on('click', function() {
      $sliderTexts.trigger('next.owl.carousel');
    });

    // Prev custom button
    $sliderPrev.on('click', function() {
      $sliderTexts.trigger('prev.owl.carousel');
    });
  });

  /**
   * SliderDiscounts
   */
  $('[data-slider-discounts]').each(function(i, sliderContainer) {
    var $sliderContainer = $(sliderContainer);
    var $slider = $sliderContainer.find('.owl-carousel');
    var id = $sliderContainer.data('slider-discounts');

    $slider.owlCarousel(
      $.extend(
        {},
        {
          // Default options
          items: 1,
          autoHeight: true,
          loop: false,
          dots: true,
          nav: false,
          lazyLoad: true,
          lazyLoadEager: 1,
          smartSpeed: 450,
          animateOut: 'zoomOut',
          animateIn: 'fadeInRight',
          navContainer: '[data-slider-discounts-nav="' + id + '"]',
          dotsContainer: '[data-slider-discounts-dots="' + id + '"]',
          navText: [
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 386.258 386.258" enable-background="new 0 0 386.258 386.258"><path d="M96.879 193.129l192.5 193.129v-386.258z"/></svg>',
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 386.258 386.258" enable-background="new 0 0 386.258 386.258"><path d="M96.879 0v386.258l192.5-193.129z"/></svg>',
          ],
        },
        $slider.data('owl') || {}
      )
    );
  });

  /**
   * Scroll to block
   */
  $('a.scroll-to').click(function(e) {
    var elemHref = $(this).attr('href');
    var dest = $(elemHref).offset().top;

    $('html:not(:animated),body:not(:animated)').animate(
      {
        scrollTop: dest,
      },
      1100,
      $.bez([0.455, 0.03, 0.515, 0.955])
    );
    e.preventDefault();
  });
  /* Scroll to block: End */

  /* Back to top button: Start */
  var navButton = $('#top-button'),
    screenHeight = $(window).height(),
    topShow = screenHeight, // hidden before (screenHeight or Number), px
    navSpeed = 1200; // speed, ms

  function scrollCalc() {
    var scrollOut = $(window).scrollTop();

    if (
      scrollOut > topShow &&
      (navButton.attr('class') == '' || navButton.attr('class') == undefined)
    )
      navButton
        .fadeIn()
        .removeClass('down')
        .addClass('up')
        .attr('title', 'Наверх');
    if (scrollOut < topShow && navButton.attr('class') == 'up')
      navButton.fadeOut().removeClass('up down');
    if (scrollOut > topShow && navButton.attr('class') == 'down')
      navButton
        .fadeIn()
        .removeClass('down')
        .addClass('up');
  }

  $(window).bind('scroll', scrollCalc);
  var lastPos = 0;

  navButton.bind('click', function() {
    scrollOut = $(window).scrollTop();

    if (navButton.attr('class') == 'up') {
      lastPos = scrollOut;
      $(window).unbind('scroll', scrollCalc);

      $('body, html').animate(
        {
          scrollTop: 0,
        },
        navSpeed,
        $.bez([0.455, 0.03, 0.515, 0.955]),
        function() {
          navButton
            .removeClass('up')
            .addClass('down')
            .attr('title', 'Вернуться');
          $(window).bind('scroll', scrollCalc);
        }
      );
    }
    if (navButton.attr('class') == 'down') {
      $(window).unbind('scroll', scrollCalc);

      $('body, html').animate(
        {
          scrollTop: lastPos,
        },
        navSpeed,
        $.bez([0.455, 0.03, 0.515, 0.955]),
        function() {
          navButton
            .removeClass('down')
            .addClass('up')
            .attr('title', 'Наверх');
          $(window).bind('scroll', scrollCalc);
        }
      );
    }
  });
  /* Back to top button: End */
});
