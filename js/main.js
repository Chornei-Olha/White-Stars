(function ($) {
  "use strict";

  // Initiate the wowjs
  new WOW().init();

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 90) {
      $(".nav-bar").addClass("nav-sticky");
      $(".carousel, .page-header").css("margin-top", "73px");
    } else {
      $(".nav-bar").removeClass("nav-sticky");
      $(".carousel, .page-header").css("margin-top", "0");
    }
  });

  // Dropdown on mouse hover
  $(document).ready(function () {
    function toggleNavbarMethod() {
      if ($(window).width() > 992) {
        $(".navbar .dropdown")
          .on("mouseover", function () {
            $(".dropdown-toggle", this).trigger("click");
          })
          .on("mouseout", function () {
            $(".dropdown-toggle", this).trigger("click").blur();
          });
      } else {
        $(".navbar .dropdown").off("mouseover").off("mouseout");
      }
    }
    toggleNavbarMethod();
    $(window).resize(toggleNavbarMethod);
  });

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 2000,
  });

  // Modal Video
  $(document).ready(function () {
    var $videoSrc;
    $(".btn-play").click(function () {
      $videoSrc = $(this).data("src");
    });
    console.log($videoSrc);

    $("#videoModal").on("shown.bs.modal", function (e) {
      $("#video").attr(
        "src",
        $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0"
      );
    });

    $("#videoModal").on("hide.bs.modal", function (e) {
      $("#video").attr("src", $videoSrc);
    });
  });

  // Testimonial Slider
  $(".testimonial-slider").slick({
    infinite: true,
    autoplay: true,
    arrows: false,
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: ".testimonial-slider-nav",
  });
  $(".testimonial-slider-nav").slick({
    arrows: false,
    dots: false,
    focusOnSelect: true,
    centerMode: true,
    centerPadding: "22px",
    slidesToShow: 3,
    asNavFor: ".testimonial-slider",
  });
  $(".testimonial .slider-nav").css({ position: "relative", height: "160px" });

  // Blogs carousel
  $(".related-slider").owlCarousel({
    autoplay: true,
    dots: false,
    loop: true,
    nav: true,
    navText: [
      '<i class="fa fa-angle-left" aria-hidden="true"></i>',
      '<i class="fa fa-angle-right" aria-hidden="true"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 2,
      },
    },
  });

  // Portfolio isotope and filter
  var portfolioIsotope = $(".portfolio-container").isotope({
    itemSelector: ".portfolio-item",
    layoutMode: "fitRows",
  });

  $("#portfolio-flters li").on("click", function () {
    $("#portfolio-flters li").removeClass("filter-active");
    $(this).addClass("filter-active");

    portfolioIsotope.isotope({ filter: $(this).data("filter") });
  });
})(jQuery);

// languages
const defaultLang = "en";

async function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;

  try {
    const res = await fetch(`lang/${lang}.json`);
    const translations = await res.json();

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });
  } catch (error) {
    console.error("Translation load error:", error);
  }
}

document.querySelectorAll("[data-lang]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.getAttribute("data-lang");
    setLanguage(lang);
  });
});

// Init
const savedLang = localStorage.getItem("lang") || defaultLang;
setLanguage(savedLang);

// testimonials
const carousel = document.getElementById("carousel");
let index = 0;

const isMobile = () => window.innerWidth <= 768;

function maxIndex() {
  const reviewCount = document.querySelectorAll(".review").length;
  const visibleCount = isMobile() ? 1 : 2;
  return Math.max(0, reviewCount - visibleCount);
}

function updateCarousel() {
  const slideWidth = isMobile() ? 100 : 50;
  const track = document.getElementById("reviewsTrack");
  track.style.transform = `translateX(-${index * slideWidth}%)`;
}

function nextSlide() {
  index = Math.min(index + 1, maxIndex());
  updateCarousel();
}

function prevSlide() {
  index = Math.max(index - 1, 0);
  updateCarousel();
}

// Swipe support
let startX = 0;

carousel.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

carousel.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;
  const delta = startX - endX;

  if (delta > 50) nextSlide();
  else if (delta < -50) prevSlide();
});

window.addEventListener("resize", () => {
  index = Math.min(index, maxIndex());
  updateCarousel();
});

document
  .querySelector(".carousel-arrow-left")
  .addEventListener("click", prevSlide);
document
  .querySelector(".carousel-arrow-right")
  .addEventListener("click", nextSlide);

window.addEventListener("load", updateCarousel);
