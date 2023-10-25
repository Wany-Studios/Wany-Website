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
        const profileUrl = resolveUrl() + 'profile/';
        const localuser = getLocalUser();

        let imageSrc;

        try {
            imageSrc = await getUserAvatar();
        } catch (err) {
            imageSrc =
                'https://static.vecteezy.com/system/resources/previews/009/397/892/original/woman-face-expression-clipart-design-illustration-free-png.png';
        }

        const sendVerificationEmailItem =
            localuser == null || localuser.account_is_verified
                ? ''
                : `<li><a href="javascript:sendVerificationEmail().then(()=>window.location.href='${
                      resolveUrl() + 'account/verification/'
                  }').catch(err => alert(err?.response?.data?.message || err.message))">Verificar e-mail</a></li>`;

        element.id = 'menu-overlay';

        if(getLocalUser() == null)
        {
            user_element = ' <li><a href="${signinUrl}">Login</a></li>';
        }
        else
        {    
            user_element = '<li><a href="${profileUrl}">Minha Conta</a></li><li><a href="javascript:menuLogout()">Sair</a></li>';
        }
        element.innerHTML = `
            <div>
                <div class="avatar">
                    <img alt="user image" src="${imageSrc}" />
                </div>
                <div><h3 title="Seu nome completo inteiro">Seu Nome completo</h3></div>
            </div>

            <ul style="width:100%">
                <li style="border-radius: 5px"><a href="" style="background: #ff5400; cursor: pointer; text-decoration: none; display: flex; justify-content: center; border-radius: 3px;"><img src="${resolveUrl() }assets/img/png/coroa-real.png">&nbsp;Teste Wany Premium</a></li>
                <li><a href="#">Fazer Upload</a></li>
                ${user_element}
                ${sendVerificationEmailItem}
                
            </ul>
        `;
        document.body.appendChild(element);
        return element;
    }

    function getPageOverlay() {
        const element = document.createElement('div');
        element.classList.add('overlay');
        document.body.appendChild(element);
        return element;
    }

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
})();
