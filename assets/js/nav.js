customElements.define(
    'wany-nav',
    class extends HTMLElement {
        constructor() {
            super();
        }

        async connectedCallback() {
            await loadComponent(this, 'nav', ['header'], []);

            const navLinkHome = this.shadowRoot.getElementById('nav-link-home');

            const navLinkGames = this.shadowRoot.getElementById('nav-link-games');

            const navLinkCommunity =
                this.shadowRoot.getElementById('nav-link-community');

            const navLinkPopular =
                this.shadowRoot.getElementById('nav-link-popular');

            navLinkHome.href = resolveUrl() + 'home/';
            navLinkHome.querySelector('img').src =
                resolveUrl() + 'assets/img/svg/navbar/icon-home.svg';

            navLinkCommunity.href = resolveUrl() + '#';
            navLinkCommunity.querySelector('img').src =
                resolveUrl() + 'assets/img/svg/navbar/megafone.svg';

            navLinkGames.href = resolveUrl() + 'games/';
            navLinkGames.querySelector('img').src =
                resolveUrl() + 'assets/img/svg/navbar/controle-videogame.svg';

            navLinkPopular.href = '#';
            navLinkPopular.querySelector('img').src =
                resolveUrl() + 'assets/img/svg/navbar/estrela.svg';
        }
    }
);
