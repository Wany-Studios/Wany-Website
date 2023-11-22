const iframeEl = document.createElement('iframe');
const gameTitleEl = document.getElementById('game-title');
const gameDisplayEl = document.getElementById('games-display');
const gameAuthorEl = document.getElementById('game-author');
const gameDescriptionEl = document.getElementById('game-description');
const fullscreenButtonEl = document.createElement('button');
const gameAuthorImg = document.getElementById('game-author-img');

window.addEventListener('resize', handleResize);

fullscreenButtonEl.innerHTML = '&#x26F6;';
fullscreenButtonEl.classList.add('fullscreen-button', 'secondary');
fullscreenButtonEl.addEventListener('click', toggleFullscreen);

document.body.appendChild(fullscreenButtonEl);

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

iframeEl.addEventListener('load', () => {
    const iframeDoc = iframeEl.contentDocument || iframeEl.contentWindow.document;
    const style = iframeDoc.createElement('style');

    style.innerHTML = `
            canvas {
                position: absolute !important;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) !important;
                width: 100% !important;
                height: 100% !important;
            }
        `;

    iframeDoc.head.appendChild(style);
    resizeCanvas();
});

loadGame();

function enterFullscreen() {
    gameDisplayEl?.requestFullscreen?.();
    gameDisplayEl?.mozRequestFullScreen?.();
    gameDisplayEl?.webkitRequestFullscreen?.();
    gameDisplayEl?.msRequestFullscreen?.();
}

function exitFullscreen() {
    document?.exitFullscreen?.();
    document?.mozCancelFullScreen?.();
    document?.webkitExitFullscreen?.();
    document?.msExitFullscreen?.();
}

function toggleFullscreen() {
    if (
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
    ) {
        exitFullscreen();
    } else {
        enterFullscreen();
    }
}

function resizeCanvas() {
    const iframeDoc = iframeEl.contentDocument || iframeEl.contentWindow.document;
    const canvas = iframeDoc.querySelector('canvas');

    if (canvas) {
        canvas.style.width = iframeEl.clientWidth + 'px';
        canvas.style.height = iframeEl.clientHeight + 'px';
    }
}

function handleResize() {
    iframeEl.style.width = '100%';
    iframeEl.style.height = '100%';
    resizeCanvas();
}

function handleFullscreenChange() {
    if (
        !document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement
    ) {
        resizeCanvas();
    }
}

async function getUserData(userId) {
    let user = {};

    try {
        const response = await getUser(userId, true);
        user = response.data;
    } catch (err) {}

    return {
        avatarUrl: user.avatar_url ?? 'https://picsum.photos/50',
        bio: user.bio ?? '',
        email: user.email ?? '',
        id: user.id ?? 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        username: user.username ?? 'unknown',
    };
}

async function loadGame() {
    const data = localStorage.getItem('game');
    if (!data) window.location.href = resolveUrl() + 'home/';

    const { description, userId, title, genre, public_game_url } = JSON.parse(data);

    const user = await getUserData(userId);

    iframeEl.src = public_game_url;
    gameTitleEl.innerText = title;
    gameAuthorEl.innerText = `Created by @${user.username}`;
    gameDescriptionEl.innerHTML = description;
    gameAuthorImg.src = await getUserAvatarUrl(user.username);
    gameAuthorImg.title = user.bio;
}

function play() {
    if (gameDisplayEl.firstChild === iframeEl) {
        exitFullscreen();
        gameDisplayEl.innerHTML = '';
    } else {
        enterFullscreen();
        gameDisplayEl.innerHTML = '';
        gameDisplayEl.appendChild(iframeEl);
    }
}
