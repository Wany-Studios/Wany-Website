document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu');
    const menuOverlay = getMenuOverlay();
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

    function getMenuOverlay() {
        const element = document.createElement('section');
        element.id = 'menu-overlay';
        element.innerHTML = `
            <div>
                <div class="avatar">
                    <img src="https://static.vecteezy.com/system/resources/previews/009/397/892/original/woman-face-expression-clipart-design-illustration-free-png.png" />
                </div>
                <div><h3 title="Seu nome completo inteiro">Seu Nome completo</h3></div>
            </div>

            <ul>
                <li><a href="#">Fazer Upload</a></li>
                <li><a href="#">Perfil</a></li>
                <li><a href="../signin">Login</a></li>
                <li><a href="javascript:menuLogout()">Sair</a></li>
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
});

async function menuLogout() {
    try {
        document.body.classList.add('waiting');
        await logout();
        document.location.href = resolveUrl() + 'logout';
    } catch (err) {
        alert('Unable to logout');
        console.error(err);
    } finally {
        document.body.classList.remove('waiting');
    }
}
