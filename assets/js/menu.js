(async () => {
    const header = document.querySelector('wany-header').shadowRoot;
    const menu = header.getElementById('menu');
    const menuOverlay = await getMenuOverlay();
    const overlay = getPageOverlay();

    let isOpen = menu.classList.contains('open');

    const menuSVGOpen = resolveUrl() + 'assets/img/svg/header/menu.svg';
    const menuSVGClosed = resolveUrl() + 'assets/img/svg/header/menu.svg';

    overlay.addEventListener('click', () => {
        isOpen = false;
        updateMenu();
    });

    menu.addEventListener('click', () => {
        isOpen = !isOpen;
        updateMenu();
    });

    function updateMenu() {
        if (isOpen) {
            document.body.classList.add('without-scroll');
            overlay.classList.add('show');
            menu.classList.add('open');
            menuOverlay.classList.add('open');
            menu.setAttribute('src', menuSVGOpen);
            return;
        }

        document.body.classList.remove('without-scroll');
        menu.classList.remove('open');
        menuOverlay.classList.remove('open');
        overlay.classList.remove('show');
        menu.setAttribute('src', menuSVGClosed);
    }

    async function getMenuOverlay() {
        const element = document.createElement('section');
        const signinUrl = resolveUrl() + 'signin/';
        const signupUrl = resolveUrl() + 'signup/';
        const profileUrl = resolveUrl() + 'profile/';
        const localuser = getLocalUser();

        let imageSrc;

        try {
            const url = await getUserAvatarUrl();
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error((await response.json()).message);
            }

            imageSrc = `${url}`;
        } catch (err) {
            imageSrc =
                'https://static.vecteezy.com/system/resources/previews/009/397/892/original/woman-face-expression-clipart-design-illustration-free-png.png';
        }

        const accountVerificationUrl = resolveUrl() + 'account/verification/';
        const sendVerificationEmailItemCallback = `() => {window.location.href='${accountVerificationUrl}'}`;
        const sendVerificationEmailItemError = `(err) => {alert(err?.response?.data?.message || err.message)}`;
        const sendVerificationEmailItem =
            localuser == null || localuser.account_is_verified
                ? ''
                : `<li>
                        <a href="javascript:sendVerificationEmail().then(${sendVerificationEmailItemCallback}).catch(${sendVerificationEmailItemError})">
                            <button type="button" class="secondary" style="width: 100%;">Verificar e-mail</button>
                        </a>
                    </li>`;

        element.id = 'menu-overlay';

        let userElements = [
            `<li><a href="${signinUrl}">Login</a></li>`,
            '',
            `<li><a href="${signupUrl}">Signup</a></li>`,
        ];

        if (!!getLocalUser()) {
            userElements[0] = `<li><a href="${profileUrl}">Minha Conta</a></li><li><a href="javascript:menuLogout()">Sair</a></li>`;
            userElements[1] = `<div>
                <div class="avatar">
                    <img alt="user image" src="${imageSrc}" style="object-fit: cover; aspect-ratio: 1/1;" />
                </div>
                
                <div>
                    <h3 title="${localuser?.username}">
                        ${localuser?.username}
                    </h3>
                </div>
            </div>`;
            userElements[2] = '';
        }

        element.innerHTML = `
            ${userElements[1]}

            <ul style="width:100%">
                <li style="border-radius: 5px">
                    <a href="${
                        resolveUrl() + 'pricing/'
                    }" style="background: #ff5400; cursor: pointer; text-decoration: none; display: flex; justify-content: center; border-radius: 3px;"><img src="${resolveUrl()}assets/img/png/coroa-real.png">
                        &nbsp;Teste Wany Premium
                    </a>
                </li>
                ${sendVerificationEmailItem}
                ${userElements[0]}
                ${userElements[2]}
            </ul>
        `;
        document.body.appendChild(element);
        return element;
    }
})();

async function menuLogout() {
    try {
        document.body.classList.add('waiting');
        await logout();
        document.location.href = resolveUrl() + '/';
    } catch (err) {
        alert('Unable to logout');
        console.error(err);
    } finally {
        document.body.classList.remove('waiting');
    }
}
