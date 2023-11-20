const iframeEl = document.createElement('iframe');
const gameTitleEl = document.getElementById('game-title');
const gameDisplayEl = document.getElementById('games-display');
const gameAuthorEl = document.getElementById('game-author');
const gameDescriptionEl = document.getElementById('game-description');

iframeEl.style.border = 'none';

const fullscreenButton = document.createElement('button');
fullscreenButton.innerHTML = '&#x26F6;';
fullscreenButton.classList.add('fullscreen-button', 'secondary');
fullscreenButton.addEventListener('click', toggleFullscreen);

document.body.appendChild(fullscreenButton);

function enterFullscreen() {
    if (gameDisplayEl.requestFullscreen) {
        gameDisplayEl.requestFullscreen();
    } else if (gameDisplayEl.mozRequestFullScreen) {
        gameDisplayEl.mozRequestFullScreen();
    } else if (gameDisplayEl.webkitRequestFullscreen) {
        gameDisplayEl.webkitRequestFullscreen();
    } else if (gameDisplayEl.msRequestFullscreen) {
        gameDisplayEl.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
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

iframeEl.onload = function () {
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
};

window.addEventListener('resize', handleResize);
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

iframeEl.style =
    'width: 100%; height: auto; align-items: center; display: flex; margin: 0 auto';

const game = localStorage.getItem('game');

if (!game) window.location.href = resolveUrl() + 'home/';

const { description, userId, title, genre, public_game_url } = JSON.parse(game);

iframeEl.src = public_game_url;
gameTitleEl.innerText = title;
gameAuthorEl.innerText = `Created by @${title}`;
gameDescriptionEl.innerHTML = description;

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
