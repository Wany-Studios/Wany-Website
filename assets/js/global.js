const VOID_CALLBACK = () => {};
const CHANNEL_EVENTS = createEnum('USER_DATA_UPDATED');
const LOCALSTORAGE = createEntries('LOCAL_USER_DATA');
const DEFAULT_OPTIONS_AXIOS = {
    withCredentials: true,
    credentials: 'include',
};

let usersCache = {};

const [postMessage, channelListenForMessage] = (() => {
    const channel = new BroadcastChannel('Wany+Channel');
    const listeners = {};

    channel.addEventListener('message', async (event) => {
        const {
            data: { type, data },
            ...aditional
        } = event;
        listeners[type]?.forEach((listener) => listener(data, aditional));
    });

    function channelListen(type, callback) {
        if (!listeners[type]) listeners[type] = [callback];
        else listeners[type].push(callback);
    }

    function postMessage(type, data) {
        channel.postMessage({ type, data });
    }

    return [postMessage, channelListen];
})();

function loadComponent(ref, componentName, cssFileNames = [], additionalJS = []) {
    return new Promise((resolve) => {
        fetch(resolveUrl() + 'assets/components/' + componentName + '.html')
            .then((response) => response.text())
            .then((html) => {
                ref.attachShadow({ mode: 'open' }).innerHTML = html;

                cssFileNames.forEach((cssName) => {
                    const link = document.createElement('link');
                    link.href = resolveUrl() + 'assets/css/' + cssName + '.css';
                    link.rel = 'stylesheet';
                    ref.shadowRoot.appendChild(link);
                });

                additionalJS.forEach((jsFileName) => {
                    const script = document.createElement('script');
                    script.src = resolveUrl() + 'assets/js/' + jsFileName + '.js';
                    ref.shadowRoot.appendChild(script);
                });
            })
            .finally(resolve);
    });
}

function resolveUrl() {
    return window.location.protocol + '//' + window.location.host + '/';
}

function getInfo() {
    return new Promise((resolve, reject) => {
        const isLocalhost =
            location.hostname === 'localhost' || location.hostname === '127.0.0.1';

        const isCloudShell = window.location.host.includes('cloudshell');

        const API_ENDPOINT =
            isLocalhost || isCloudShell ? '/api/' : 'api.wany.com.br';

        axios.get(API_ENDPOINT, DEFAULT_OPTIONS_AXIOS).then(resolve).catch(reject);
    });
}

/**
 *
 * @type {function(): Promise<Readonly<{
 * add_game_image_url,
 * avatar_url,
 * create_game_url,
 * current_user_url,
 * delete_game_url,
 * forgot_password_url,
 * public_get_game_url,
 * my_games_url,
 * login_url,
 * logout_url,
 * public_game_image_url,
 * public_game_url,
 * public_url,
 * remove_game_image_url,
 * reset_password_url,
 * search_games_url,
 * send_verification_email_url,
 * signup_url,
 * upload_avatar_url,
 * public_user_url,
 * update_user_url,
 * verify_email_url,
 * }>>}
 */
const getRoutes = (() => {
    return async function (replaces = {}) {
        const { data } = await getInfo();

        const routes = {
            add_game_image_url: data.add_game_image_url,
            avatar_url: data.avatar_url,
            create_game_url: data.create_game_url,
            current_user_url: data.current_user_url,
            delete_game_url: data.delete_game_url,
            forgot_password_url: data.forgot_password_url,
            public_get_game_url: data.public_get_game_url,
            login_url: data.login_url,
            logout_url: data.logout_url,
            public_game_image_url: data.public_game_image_url,
            public_game_url: data.public_game_url,
            my_games_url: data.my_games_url,
            public_url: data.public_url,
            remove_game_image_url: data.remove_game_image_url,
            reset_password_url: data.reset_password_url,
            search_games_url: data.search_games_url,
            send_verification_email_url: data.send_verification_email_url,
            signup_url: data.signup_url,
            upload_avatar_url: data.upload_avatar_url,
            public_user_url: data.user_url,
            update_user_url: data.update_user_url,
            verify_email_url: data.verify_email_url,
        };

        return Object.freeze(
            Object.fromEntries(
                Object.entries(routes).map(([key, value]) => {
                    Object.entries(replaces).forEach(
                        ([replaceKey, replaceValue]) => {
                            value = value.replace(
                                '{' + replaceKey + '}',
                                replaceValue
                            );
                        }
                    );

                    return [key, value];
                })
            )
        );
    };
})();

function logout() {
    return new Promise(async (resolve, reject) => {
        const routes = await getRoutes().catch(reject);

        axios
            .get(routes.logout_url, DEFAULT_OPTIONS_AXIOS)
            .then(async () => {
                await deleteLocalUser();
                resolve();
            })
            .catch(reject);
    });
}

function montaListaCardsGames(games) {
    return games.map(
        (
            game = {
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
            }
        ) => {
            return () => {
                const el = htmlToElement(`
                  <div class="swiper-slide" title='${game.title}'>
                    <div class="item">
                        <img
                            loading="lazy"
                            src="${
                                game.public_game_image_urls[0] ||
                                `https://picsum.photos/seed/${Math.random()}/200`
                            }"
                        />
                    </div>
                  </div>`);

                el.querySelector('img').onclick = () => openGameModal(game);

                return el;
            };
        }
    );
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

function getPageOverlay() {
    if (!document.querySelector('.overlay')) {
        const element = document.createElement('div');
        element.classList.add('overlay');
        document.body.appendChild(element);
    }

    return document.querySelector('.overlay');
}

function createModal({
    title,
    header,
    body,
    footer,
    yes,
    no,
    cancel,
    onYes,
    onNo,
    onCancel,
} = {}) {
    const overlay = getPageOverlay();
    const abortController = new AbortController();

    const close = () => {
        abortController.abort();
        modalEl.classList.remove('open');
        document.body.classList.remove('without-scroll');
        overlay.classList.remove('show');
        modalEl.remove();
    };

    const open = () => {
        setTimeout(() => {
            overlay.addEventListener(
                'click',
                (ev) => {
                    if (overlay !== ev.target) return;
                    close();
                },
                {
                    once: true,
                    signal: abortController.signal,
                }
            );
        }, 100);

        document.body.classList.add('without-scroll');
        modalEl.classList.add('open');
        overlay.classList.add('show');
    };

    const modalEl = htmlToElement(`
        <div class="modal">
            <section class="modal-content">
                <a id="close-modal" class="close-modal" href="#">x</a>

                <div class="modal-header">
                    <h1 class="modal-title">${title || 'Modal'}</h1>
                    <div>${header || ''}</div>
                </div>
                
                ${!!body ? '<hr />' : ''}

                <div class="modal-body">
                    ${body || ''}
                </div>
                
                ${!!footer ? '<hr />' : ''}
                
                <div class="modal-footer">
                    <div style="display:flex; gap:4px; justify-content: flex-end;">
                        ${!!yes ? `<button id="modal-yes">${yes}</button>` : ''}
                        ${
                            !!cancel
                                ? `<button id="modal-cancel" class="secondary close-modal">${cancel}</button>`
                                : ''
                        }
                    </div>
                </div>
            </section>
        </div>
    `);

    document.body.appendChild(modalEl);

    [...document.querySelectorAll('.close-modal')].forEach((item) => {
        item.addEventListener('click', () => close());
    });

    if (!!yes) {
        modalEl.querySelector('#modal-yes').addEventListener('click', async () => {
            onYes?.();
        });
    }
    if (!!cancel) {
        modalEl
            .querySelector('#modal-cancel')
            .addEventListener('click', async () => {
                onCancel?.();
                close();
            });
    }

    return { open, close, el: modalEl };
}

async function openGameModal(
    game = {
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
    }
) {
    let user = usersCache[game.userId];
    let owned = false;
    let aditional = '';

    if (!user) {
        const currentUser = getLocalUser();

        if (currentUser?.id === game.userId) {
            aditional = `
                <div class="w100" style="margin-top:10px;display:flex;justify-content:flex-end;">
                    <button id="delete-game-btn" class="secondary">
                        Delete game
                    </button>
                </div>
            `;
            owned = true;
            user = currentUser;
        } else {
            const response = await getUser(game.userId, true);
            user = response.data;
        }
    }

    const modal = createModal({
        title: game.title,
        body: `
            <section style="height:100%;display:grid;place-items:center;">
                <div class="w100" style="margin-bottom:20px;">
                    <span>Created by <a href="#" style="color:#fff;" title="${user.bio}">@${user.username}</a></span>
                </div>

                <div class="w100">
                    <span>Description</span>
                    <textarea class="w100" style="resize:vertical;max-height:250px;margin-top:5px;" readonly>${game.description}</textarea>
                </div>

                <div class="w100" style="margin-top:10px;">
                    <span>Genre</span>
                    <input class="input w100" style="cursor:auto;" type="text" value="${game.genre}" readonly />
                </div>

                ${aditional}
            </section>
        `,
        yes: 'Play',
        cancel: 'Close',
        onYes() {
            playGame(game);
        },
    });

    if (owned) {
        modal.el.querySelector('#delete-game-btn').onclick = async () => {
            try {
                document.body.classList.add('waiting');
                await deleteGame(game.id);
                document.body.classList.remove('waiting');
                alert('Game deleted successfully');
                modal.close();
            } catch (err) {
                alert(err.response?.data?.message ?? 'Unable to delete game');
            }
        };
    }
    modal.open();

    return modal;
}

function playGame(gameObj) {
    localStorage.setItem('game', JSON.stringify(gameObj));
    window.location.href = resolveUrl() + 'play/';
}

function deleteLocalUser() {
    localStorage.removeItem(LOCALSTORAGE.LOCAL_USER_DATA);
}

function saveLocalUser() {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await getMe();

            const {
                avatar,
                avatar_url,
                birth_date,
                created_at,
                email,
                id,
                role,
                bio,
                updated_at,
                username,
                account_is_verified,
            } = response.data;

            postMessage(CHANNEL_EVENTS.USER_DATA_UPDATED, { ...response.data });

            if (!response.data) {
                return deleteLocalUser();
            }

            localStorage.setItem(
                LOCALSTORAGE.LOCAL_USER_DATA,
                JSON.stringify({
                    avatar,
                    avatar_url,
                    birth_date,
                    created_at,
                    email,
                    bio,
                    id,
                    role,
                    updated_at,
                    username,
                    account_is_verified,
                })
            );

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

function getLocalUser() {
    return JSON.parse(localStorage.getItem(LOCALSTORAGE.LOCAL_USER_DATA) ?? 'null');
}

async function getUserAvatarUrl(username = null) {
    if (!username) {
        const user = getLocalUser();

        if (!user) {
            return 'https://picsum.photos/50';
        }

        username = user.username;
    }

    const routes = await getRoutes({ username });

    return await new Promise((resolve) => {
        fetch(routes.avatar_url)
            .then((response) => {
                if (!response.ok) return resolve('https://picsum.photos/50');
                resolve(routes.avatar_url);
            })
            .catch(() => resolve('https://picsum.photos/50'));
    });
}

function getUserAvatar(username = null) {
    return new Promise(async (resolve, reject) => {
        if (!username) {
            const user = getLocalUser();

            if (!user) {
                return reject('Must be logged in or provide a username.');
            } else {
                username = user.username;
            }
        }

        const routes = await getRoutes({ username });

        axios
            .get(routes.avatar_url, DEFAULT_OPTIONS_AXIOS)
            .then(resolve)
            .catch(reject);
    });
}

function verifyAccount(token) {
    return new Promise(async (resolve, reject) => {
        const routes = await getRoutes({ token });

        axios
            .post(routes.verify_email_url, DEFAULT_OPTIONS_AXIOS)
            .then(resolve)
            .catch(reject);
    });
}

function resetPassword() {
    return new Promise(async (resolve, reject) => {
        const routes = await getRoutes().catch(reject);

        axios
            .post(routes.reset_password_url, DEFAULT_OPTIONS_AXIOS)
            .then(resolve)
            .catch(reject);
    });
}

function requestResetPassword(email) {
    return new Promise(async (resolve, reject) => {
        const routes = await getRoutes().catch(reject);

        axios
            .post(routes.forgot_password_url, { email }, DEFAULT_OPTIONS_AXIOS)
            .then(resolve)
            .catch(reject);
    });
}

function getUser(userIdOrUsername, isById = false) {
    return new Promise(async (resolve, reject) => {
        const routes = await getRoutes({
            username: userIdOrUsername,
            byId: isById,
        }).catch(reject);

        axios
            .get(routes.public_user_url, DEFAULT_OPTIONS_AXIOS)
            .then((response) => {
                resolve(response);
                const { id, ...data } = response.data;
                usersCache[id] = { id, ...data };
            })
            .catch(reject);
    });
}

function getMe() {
    return new Promise(async (resolve, reject) => {
        const routes = await getRoutes().catch(reject);

        axios
            .get(routes.current_user_url, DEFAULT_OPTIONS_AXIOS)
            .then(resolve)
            .catch(reject);
    });
}

function updateMe(data = { bio, username, password, dateOfBirth }) {
    return new Promise(async (resolve, reject) => {
        const routes = await getRoutes().catch(reject);

        axios
            .patch(
                routes.update_user_url,
                JSON.parse(JSON.stringify(data)),
                DEFAULT_OPTIONS_AXIOS
            )
            .then(resolve)
            .catch(reject);
    });
}

function getMyGames() {
    return new Promise(async (resolve, reject) => {
        const routes = await getRoutes().catch(reject);

        axios
            .get(routes.my_games_url, DEFAULT_OPTIONS_AXIOS)
            .then(resolve)
            .catch(reject);
    });
}

function makeUploadGameImage({ gameId, isCover }) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.addEventListener('change', handle);
    input.click();

    async function handle() {
        const fileList = input.files;

        if (fileList.length === 0) {
            return reject('No file was selected.');
        }

        try {
            const response = await uploadGameImage({
                gameId,
                isCover,
                file: fileList[0],
            });

            return response;
        } catch (err) {
            console.error('Unable to upload game: ' + err);
        }
    }
}

function uploadGameImage({ gameId, file, isCover }) {
    return new Promise(async (resolve, reject) => {
        const routes = await getRoutes().catch(reject);
        const form = new FormData();

        form.append('file', file);

        axios
            .post(
                routes.add_game_image_url.replace('{id}', gameId) +
                    '?cover=' +
                    isCover,
                form,
                {
                    ...DEFAULT_OPTIONS_AXIOS,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
            .then(resolve)
            .catch(reject);
    });
}

function makeUploadUserAvatar() {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', handle);
        input.click();

        async function handle() {
            const fileList = input.files;

            if (fileList.length === 0) {
                return reject('No file was selected.');
            }

            try {
                const response = await uploadUserAvatar({
                    file: fileList[0],
                });

                return resolve(response);
            } catch (err) {
                return reject(err);
            }
        }
    });
}

function uploadUserAvatar({ file }) {
    return new Promise(async (resolve, reject) => {
        const routes = await getRoutes().catch(reject);
        const form = new FormData();

        form.append('file', file);

        axios
            .post(routes.upload_avatar_url, form, {
                ...DEFAULT_OPTIONS_AXIOS,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(resolve)
            .catch(reject);
    });
}

function makeUploadGame({ title, description, genre }) {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.zip';
        input.addEventListener('change', handle);
        input.click();

        async function handle() {
            const fileList = input.files;

            if (fileList.length === 0) {
                return reject('No file was selected.');
            }

            try {
                const response = await uploadGame({
                    title,
                    description,
                    genre,
                    file: fileList[0],
                });

                return resolve(response);
            } catch (err) {
                return reject(err);
            }
        }
    });
}

function uploadGame({ title, description, genre, file }) {
    return new Promise(async (resolve, reject) => {
        const routes = await getRoutes().catch(reject);
        const form = new FormData();

        form.append('file', file);
        form.append('genre', genre);
        form.append('title', title);
        form.append('description', description);

        axios
            .post(routes.create_game_url, form, {
                ...DEFAULT_OPTIONS_AXIOS,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(resolve)
            .catch(reject);
    });
}

function deleteGame(gameId) {
    return new Promise(async (resolve, reject) => {
        const routes = await getRoutes({ id: gameId }).catch(reject);
        axios
            .delete(routes.delete_game_url, {}, DEFAULT_OPTIONS_AXIOS)
            .then(resolve)
            .catch(reject);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function searchGames() {
    return new Promise(async (resolve, reject) => {
        const routes = await getRoutes();

        axios
            .get(routes.search_games_url, DEFAULT_OPTIONS_AXIOS)
            .then(resolve)
            .catch(reject);
    });
}

function sendVerificationEmail() {
    return new Promise(async (resolve, reject) => {
        const { account_is_verified, email } = getLocalUser();

        if (account_is_verified) return reject('Account already verified.');

        const routes = await getRoutes();

        document.body.classList.add('waiting');

        axios
            .post(
                routes.send_verification_email_url,
                { email },
                DEFAULT_OPTIONS_AXIOS
            )
            .then(resolve)
            .catch(reject)
            .finally(() => {
                document.body.classList.remove('waiting');
            });
    });
}

function createEnum(...entries) {
    return Object.freeze(
        Object.fromEntries(entries.map((entry, index) => [entry, index]))
    );
}

function createEntries(...entries) {
    return Object.freeze(Object.fromEntries(entries.map((entry) => [entry, entry])));
}

getRoutes().then((r) => console.table(r));
