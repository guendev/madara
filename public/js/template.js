$(document).ready(function () {
  $('ul.c-user_menu > li').each(function (i, e) {
    $(this).clone().appendTo('.mobile-menu ul.navbar-nav')
  })

  /*sub-header*/
  $('li.menu-item-has-children a[href^="#"]').on('touchend click', function (e) {
    const $this = $(this)
    if ($this.parents('.c-sub-header-nav').length) {
      e.preventDefault()
      $this.parent().toggleClass('active')
    } else {
      e.preventDefault()
    }
  })

  /*menu off-canvas*/

  $('.off-canvas ul > li.menu-item-has-children').addClass('hiden-sub-canvas')
  $('.off-canvas ul >li.menu-item-has-children').append(
    '<i class="fa fa-caret-right" aria-hidden="true"></i>'
  )
  const menu_open = $('.menu_icon__open')
  const menu_close = $('.menu_icon__close')
  const menu_slide = $('.off-canvas')
  const menu_sign_in = $('.mobile-menu .btn-active-modal')

  menu_open.on('click', function () {
    menu_open.addClass('active')
    menu_slide.addClass('active')
    $('body').addClass('open_canvas')
  })

  menu_close.on('click', function (e) {
    e.preventDefault()
    menu_open.removeClass('active')
    menu_slide.removeClass('active')
    $('body').removeClass('open_canvas')
  })

  menu_sign_in.on('click', function (e) {
    e.preventDefault()
    menu_open.removeClass('active')
    menu_slide.removeClass('active')
    $('body').removeClass('open_canvas')
  })

  $('.off-canvas ul >li.menu-item-has-children > i').on('click', function () {
    const $this = $(this).parent('li')
    $this.toggleClass('active').children('ul').slideToggle()
    return false
  })
  $(document).on(' touchend click', function (e) {
    if (
      !$(e.target).hasClass('menu_icon__open') &&
      !$(e.target).closest('.off-canvas').hasClass('active')
    ) {
      menu_slide.removeClass('active')
      menu_open.removeClass('active')
      $('body').removeClass('open_canvas')
    }
  })
  /**
   * Sticky Menu
   * @type {Window}
   */
  const stickyNavigation =
    $('.c-sub-header-nav').length > 0 ? $('.c-sub-header-nav').offset().top : 0
  const cloneHeader = $('<div>', {
    class: 'clone-header'
  })
  $(cloneHeader).insertBefore('.c-sub-header-nav')
  const navigationHeight = $('.c-sub-header-nav').outerHeight(true)

  /**
   * Compare scrollTop position to add .sticky class
   */
  const madara_need_add_sticky = function () {
    var scrollTop = $(window).scrollTop()
    if (scrollTop - stickyNavigation > 750 && $('body').hasClass('sticky-enabled')) {
      $(cloneHeader).css('height', navigationHeight)
      $('.c-sub-header-nav').addClass('sticky')
      $('body').addClass('sticky__active')
      $('.c-sub-header-nav').fadeIn(300, 'linear')
    } else if (
      scrollTop - stickyNavigation <= navigationHeight + 5 &&
      $('body').hasClass('sticky-enabled')
    ) {
      // $(cloneHeader).remove();
      $(cloneHeader).css('height', 0)
      $('.c-sub-header-nav').removeClass('sticky')
      $('body').removeClass('sticky__active')
    }
  }

  /**
   * Detect scrolling up or down, to add .sticky class
   */
  const stickyNav = function () {
    if (typeof stickyNav.x == 'undefined') {
      stickyNav.x = window.pageXOffset
      stickyNav.y = window.pageYOffset
    }
    const diffX = stickyNav.x - window.pageXOffset
    const diffY = stickyNav.y - window.pageYOffset

    if (diffX < 0) {
      // Scroll right
    } else if (diffX > 0) {
      // Scroll left
    } else if (diffY < 0) {
      // Scroll down
      if ($('body').hasClass('sticky-style-2')) {
        $('.c-sub-header-nav').removeClass('sticky')
        $('body').removeClass('sticky__active')
        $('.clone-header').css('height', 0)
      } else {
        madara_need_add_sticky()
      }
    } else if (diffY > 0) {
      // Scroll up

      madara_need_add_sticky()
    } else {
      // First scroll event
    }

    stickyNav.x = window.pageXOffset
    stickyNav.y = window.pageYOffset
  }

  if ($('body').hasClass('sticky-enabled')) {
    $(window).on('scroll', function () {
      if ($(window).width() >= 768 || $('body').hasClass('sticky-for-mobile')) {
        stickyNav()
      }
    })
  }

  //Go To Top
  $('.go-to-top').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 500)
  })
  $(window).on('scroll', function () {
    if ($(window).scrollTop() >= window.innerHeight * 0.5) {
      if (!$('.go-to-top').hasClass('active')) {
        $('.go-to-top').addClass('active')
      }
    } else {
      $('.go-to-top').removeClass('active')
    }
  })

  // search
  $('.main-menu-search .open-search-main-menu').on('click', function () {
    let $adv_search_link
    const $this = $(this)

    if ($this.hasClass('search-open')) {
      $this.parents('.c-header__top').find('.search-main-menu').removeClass('active')
      setTimeout(function () {
        $this.parents('.c-header__top').find('.search-main-menu').find('input[type="text"]').blur()
      }, 200)
      $this.removeClass('search-open')

      if ($('body').hasClass('mobile')) {
        $adv_search_link = $('.link-adv-search', $('#blog-post-search'))
        if ($adv_search_link.length > 0) {
          $adv_search_link.remove()
        }
      }
    } else {
      $this.parents('.c-header__top').find('.search-main-menu').addClass('active')
      setTimeout(function () {
        $this.parents('.c-header__top').find('.search-main-menu').find('input[type="text"]').focus()
      }, 200)
      $this.addClass('search-open')

      if ($('body').hasClass('mobile')) {
        $adv_search_link = $('.link-adv-search', $this.closest('.widget-manga-search'))
        if ($adv_search_link.length > 0) {
          $('#blog-post-search').append($adv_search_link.clone())
        }
      }
    }
  })

  $('.genres_wrap .btn-genres').click(function () {
    const $this = $(this)
    let $this_parent
    $this.toggleClass('active')
    $this_parent = $this.parents('.genres_wrap')
    $this_parent.find('.genres__collapse').slideToggle(300)
    $this_parent.find('.c-blog__heading.style-3').toggleClass('active')
  })

  //Mobile Collapse Genres
  $(document).on('click', '.c-sub-header-nav .mobile-icon', function (e) {
    const $this = $(this)

    if ($this.parent().hasClass('active')) {
      $this.parent().removeClass('active')
    } else {
      $this.parent().addClass('active')
    }
  })

  const mobile_pagination_btn_attach_click = function () {
    var pagination_btn = $('.mobile-nav-btn')
    var select_pagination = $('.select-pagination')

    // unbind event first
    pagination_btn.unbind('click')
    pagination_btn.on('click', function (e) {
      e.preventDefault()
      if (select_pagination.parent().hasClass('active')) {
        select_pagination.parent().removeClass('active')
      } else {
        select_pagination.parent().addClass('active')
      }
    })
  }
  mobile_pagination_btn_attach_click()

  // re-attach click event after ajax loading chapter
  $(document).on('wp_manga_on_chapter_navlinks_click', function () {
    mobile_pagination_btn_attach_click()
  })

  $('#btn_view_full_image').on('click', function (e) {
    $('.container').css({ width: 'auto', 'max-width': 'initial' })

    $(this).hide()

    e.preventDefault()
    e.stopPropagation()
  })

  document.querySelectorAll('.logout-button').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault()
      window.Cookies.remove('_token')
      window.location = '/'
    })
  })

  $('.slider__container').each(function () {
    $(this).slick({
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: parseInt($(this).attr('show')) || 0,
      autoplay: true,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: true,
            centerMode: false,
            dots: true
          }
        },
        {
          breakpoint: 660,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            variableWidth: false,
            dots: true
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            variableWidth: false
          }
        }
      ]
    })
  })

  document.querySelectorAll('.wp-manga-action-button._dark-theme').forEach((element) => {
    element.addEventListener('click', () => {
      if (window.Cookies.get('lightTheme')) {
        window.Cookies.remove('lightTheme')
        document.querySelector('body').classList.add('text-ui-light')
      } else {
        window.Cookies.set('lightTheme')
        document.querySelector('body').classList.remove('text-ui-light')
      }
    })
  })

  try {
    ;(adsbygoogle = window.adsbygoogle || []).push({})
  } catch (e) {
    // No Ads Here
  }

  // Clear console log
  setTimeout(() => {
    // console.clear()
    console.log(
      '%c🌈 Welcome\n%c~ We love you! ~',
      'filter: invert(1); font-size: 28px; font-weight: bolder; font-family: "Rubik"; margin-top: 20px; margin-bottom: 8px;',
      'color: #ff7755; font-size: 28px; font-weight: bolder; font-family: "Rubik"'
    )
  }, 100)

  document.querySelectorAll('.chapter-img').forEach((element, index) => {
    element.addEventListener('error', () => {
      console.log('Error image', index)
      element.remove()
    })
  })
})
