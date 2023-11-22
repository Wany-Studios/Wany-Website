const gamesListCarousel = document.getElementById('game-list-carousel-items');
const searchInputEl = document.getElementById('search-bar');
const debounceSearch = debounce(search, 300);

window.addEventListener('load', async () => {
    search();
});

searchInputEl.addEventListener('input', () => {
    document.body.classList.add('waiting');
    debounceSearch();
    document.body.classList.remove('waiting');
});

async function search() {
    const searchTerm = searchInputEl.value;
    let games = [];

    try {
        const searchQuery =
            searchTerm.length == 0
                ? []
                : ['title'].map((term) => `${term}=${searchTerm}`);
        const response = await searchGames(searchQuery);
        games = response.data.games;
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Unable to get games from server');
    }

    await renderGames(games);
}

async function renderGames(games) {
    gamesListCarousel.innerHTML = '';

    const listGenerateCards = generateListCardGames(games);
    const listCards = listGenerateCards.map((renderCard) => renderCard());

    for (const cardEl of listCards) {
        cardEl.querySelector('img').style.width = 'auto';
        gamesListCarousel.appendChild(cardEl);
    }
}
