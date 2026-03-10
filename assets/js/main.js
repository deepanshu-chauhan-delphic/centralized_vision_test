/*-- header-toggle --*/
jQuery(document).ready(function ($) {
    // document start
    // Navbar
    $("<span class='clickD'></span>").insertAfter(".navbar-nav li.menu-item-has-children > a");
    $('.navbar-nav li .clickD').click(function (e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.next().hasClass('show')) {
            $this.next().removeClass('show');
            $this.removeClass('toggled');
        }
        else {
            $this.parent().parent().find('.sub-menu').removeClass('show');
            $this.parent().parent().find('.toggled').removeClass('toggled');
            $this.next().toggleClass('show');
            $this.toggleClass('toggled');
        }
    });

    $(window).on('resize', function () {
        if ($(this).width() < 1025) {
            $('html').click(function () {
                $('.navbar-nav li .clickD').removeClass('toggled');
                $('.toggled').removeClass('toggled');
                $('.sub-menu').removeClass('show');
            });
            $(document).click(function () {
                $('.navbar-nav li .clickD').removeClass('toggled');
                $('.toggled').removeClass('toggled');
                $('.sub-menu').removeClass('show');
            });
            $('.navbar-nav').click(function (e) {
                e.stopPropagation();
            });
        }
    });
    // Navbar end



    /* ===== For menu animation === */
    $(".navbar-toggler").click(function () {
        $(".navbar-toggler").toggleClass("open");
        $(".navbar-toggler .stick").toggleClass("open");
        $('body,html').toggleClass("open-nav");
    });

    // Navbar end

    // counter js
    function animateCounter($el, target, duration) {
    let start = 0;
    let increment = Math.ceil(target / (duration / 10)); // 10ms interval steps
    let counter = setInterval(function () {
      start += increment;
      if (start >= target) {
        $el.text(target.toLocaleString() + " +");
        clearInterval(counter);
      } else {
        $el.text(start.toLocaleString());
      }
    }, 10);
  }

  $(document).ready(function () {
    let triggered = false;
    let $section = $('.counter-sec');
    let $counter = $section.find('.count-vl');
    let target = parseInt($counter.data('target'));

    $(window).on('scroll', function () {
      let sectionTop = $section.offset().top;
      let scrollTop = $(window).scrollTop();
      let windowHeight = $(window).height();

      if (!triggered && scrollTop + windowHeight > sectionTop) {
        animateCounter($counter, target, 5000); // 2 seconds
        triggered = true;
      }
    });
  });

})