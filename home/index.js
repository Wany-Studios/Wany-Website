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

    document.querySelector('.trending-games').style.display = '';
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

    document.querySelector('.games-genre').style.display = '';
}

window.addEventListener('load', async function () {
    try {
        const response = await searchGames();
        const { games } = response.data;

        document
            .querySelector('#trending-games-carousel')
            .querySelector('.swiper-wrapper').innerHTML = '';

        games.forEach(
            ({
                add_game_image_url,
                createdAt,
                delete_game_url,
                description,
                genre,
                id,
                public_game_image_urls,
                public_game_url,
                public_get_game_url,
                title,
                updatedAt,
                userId,
            }) => {
                const html = `
                  <div class="swiper-slide" title="${title} - ${description}">
                    <div class="item" onclick="window.location.href = '${public_game_url}'">
                        <img
                            loading="lazy"
                            src="${
                                public_game_image_urls[0] ||
                                `https://picsum.photos/seed/${Math.random()}/200`
                            }"
                        />
                    </div>
                  </div>`;

                document
                    .querySelector('#trending-games-carousel')
                    .querySelector('.swiper-wrapper').innerHTML += html;
            }
        );
    } catch (e) {
        console.error(e);
    }

    loadTrendingGamesCarousel();
    loadGamesCarousel();
});
