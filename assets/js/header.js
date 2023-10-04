customElements.define(
    'wany-header',
    class extends HTMLElement {
        constructor() {
            super();
        }

        async connectedCallback() {
            await loadComponent(this, 'header', ['header', 'menu'], ['menu']);

            document.head.appendChild(
                (() => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = resolveUrl() + 'assets/css/menu.css';
                    return link;
                })()
            );

            this.shadowRoot.getElementById('header-logo-link').href =
                resolveUrl() + 'home/';

            this.shadowRoot
                .getElementById('header-logo-link')
                .querySelector('img').src = resolveUrl() + 'assets/img/logo.png';

            this.shadowRoot.getElementById('header-person-link').href =
                resolveUrl() + 'signin/';

            this.shadowRoot
                .getElementById('header-person-link')
                .querySelector('img').src =
                resolveUrl() + 'assets/img/svg/header/person.svg';

            this.shadowRoot.getElementById('menu').src =
                resolveUrl() + 'assets/img/svg/header/menu.svg';
        }
    }
);
