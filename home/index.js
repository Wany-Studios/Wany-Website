function loadTrendingGamesCarousel() {
    const carousel = new Swiper('#trending-games-carousel', {
        slidesPerView: 1,
        spaceBetween: 10,
        pagination: {
            el: '#trending-games-carousel-pagination',
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
        '#trending-games-carousel .right-arrow'
    );
    const leftArrow = document.querySelector('#trending-games-carousel .left-arrow');

    rightArrow.onclick = function () {
        carousel.slideNext();
    };

    leftArrow.onclick = function () {
        carousel.slidePrev();
    };
}

function loadGamesCarousel() {
    const elements = [...document.querySelectorAll('.games-carousel')];

    elements.forEach((item) => {
        new Swiper(item, {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: {
                el: item.querySelector('.swiper-pagination'),
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

window.addEventListener('load', async function () {
    try {
        const response = await searchGames();
        const { games } = response.data;
        const lista = montaListaCardsGames(games);

        if (lista.length === 0) {
            document.querySelector('#trending-games-carousel-items').innerHTML =
                '<h3 style="width: 100%;text-align: center;">Jogos não encontrados</h3>';

            return;
        }

        lista.slice(0, 3).forEach((item) => {
            document
                .querySelector('#trending-games-carousel-items')
                .appendChild(item());
        });

        shuffleArray(lista).forEach((item) => {
            document.querySelector('#game-list-carousel-items').appendChild(item());
        });
    } catch (e) {
        document.querySelector('#trending-games-carousel-items').innerHTML =
            '<h3 style="width: 100%;text-align: center;">Jogos não encontrados</h3>';

        console.error(e);
    }

    loadTrendingGamesCarousel();
    loadGamesCarousel();

    document.querySelectorAll('.carousel').forEach((item) => {
        item.style.display = '';
    });
});
