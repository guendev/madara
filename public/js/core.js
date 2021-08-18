;(function ($) {
  'use strict'

  /**
   * Add 'mobile' class on Responsive Mode
   * @type {Window}
   */
  $(window).on('load resize', function () {
    const viewportWidth = window.outerWidth
    const siteHeader = $('.site-header')

    const isMobile = siteHeader.hasClass('mobile')

    if (viewportWidth < 1008) {
      if (!isMobile) {
        siteHeader.addClass('mobile')
        $('body').addClass('mobile')
      }
    } else {
      if (isMobile) {
        siteHeader.removeClass('mobile')
        $('body').removeClass('mobile')
      }
    }
  })
})(jQuery)
