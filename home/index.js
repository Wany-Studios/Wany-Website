function loadTrendingGamesCarousel() {
    const carousel = new Swiper("#trending-games-carousel", {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
            el: "#trending-games-carousel-pagination",
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 1,
                spaceBetween: 40,
            },
            1024: {
                slidesPerView: 1,
                spaceBetween: 50,
            },
        },
    });

    const rightArrow = document.querySelector(
        "#trending-games-carousel .right-arrow"
    );
    const leftArrow = document.querySelector("#trending-games-carousel .left-arrow");

    rightArrow.onclick = function () {
        carousel.slideNext();
    };

    leftArrow.onclick = function () {
        carousel.slidePrev();
    };
}

window.addEventListener("load", async function () {
    document.querySelector("#trending-games-carousel-items").innerHTML =
        '<h3 style="width: 100%;text-align: center;">Buscando jogos...</h3>';

    try {
        const response = await searchGames();
        const { games } = response.data;
        const lista = generateListCardGames(games);

        if (lista.length === 0) {
            document.querySelector("#trending-games-carousel-items").innerHTML =
                '<h3 style="width: 100%;text-align: center;">Jogos não encontrados</h3>';

            return;
        }

        document.querySelector("#trending-games-carousel-items").innerHTML = "";

        lista.slice(0, 3).forEach((item) => {
            const el = item();
            document.querySelector("#trending-games-carousel-items").appendChild(el);
        });

        shuffleArray(lista).forEach((item) => {
            document.querySelector("#game-list-carousel-items").appendChild(item());
        });
    } catch (e) {
        console.error(e);

        document.querySelector("#trending-games-carousel-items").innerHTML =
            '<h3 style="width: 100%;text-align: center;">Jogos não encontrados</h3>';

        return;
    }

    document.querySelectorAll(".carousel").forEach((item) => {
        item.style.display = "";
    });

    loadTrendingGamesCarousel();
    // loadGamesCarousel();
});
