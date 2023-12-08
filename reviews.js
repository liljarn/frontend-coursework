jQuery(document).ready(function($) {
  "use strict";
  $('.owl-carousel').owlCarousel({
    loop: true,
    center: true,
    autoWidth: true,
    autoplay: true,
    dots: true,
    nav: true,
    autoplayTimeout: 8000,
    smartSpeed: 450,
    navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
    margin: 20,
    responsive: {
      0: {
        items: 1.2,
        margin: 10
      },
      425: {
        items: 1.5,
        margin: 15
      },
      768: {
        items: 2
      },
      1170: {
        items: 3
      }
    }
  });
});