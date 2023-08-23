function loadGamesCarousel() {
  const elements = [...document.querySelectorAll(".games-carousel")];

  elements.forEach((item) => {
    new Swiper(item, {
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: item.querySelector(".swiper-pagination"),
        clickable: true,
      },
      breakpoints: {
        350: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        600: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 50,
        },
      },
    });
  });
}

window.addEventListener("load", function () {
  loadGamesCarousel();
});

//  const gamesCarousel = new Swiper("#games-carousel", {
//   slidesPerView: 1,
//   spaceBetween: 10,
//   pagination: {
//     el: ".swiper-pagination",
//     clickable: true,
//   },
//   breakpoints: {
//     640: {
//       slidesPerView: 2,
//       spaceBetween: 20,
//     },
//     768: {
//       slidesPerView: 4,
//       spaceBetween: 40,
//     },
//     1024: {
//       slidesPerView: 5,
//       spaceBetween: 50,
//     },
//   },
// })

// const mainGamesCarousel = new Swiper("#main-games-carousel", {
//   effect: "coverflow",
//   grabCursor: true,
//   centeredSlides: true,
//   slidesPerView: "auto",
//   coverflowEffect: {
//     rotate: 50,
//     stretch: 0,
//     depth: 100,
//     modifier: 1,
//     slideShadows: false,
//   },
//   pagination: {
//     el: ".swiper-pagination",
//   },
// });
