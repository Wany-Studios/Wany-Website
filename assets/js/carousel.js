function loadGamesCarousel() {
    const elements = [...document.querySelectorAll(".games-carousel")];

    elements.forEach((item) => {
        new Swiper(item, {
            slidesPerView: "auto",
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
