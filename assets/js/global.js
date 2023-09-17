const VOID_CALLBACK = () => {};
const CHANNEL_EVENTS = createEnum('USER_DATA_UPDATED');
const LOCALSTORAGE = createEntries('LOCAL_USER_DATA');
const DEFAULT_OPTIONS_AXIOS = {
    withCredentials: true,
    credentials: 'include',
};

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
 *  avatar_url,
 *  current_user_url,
 *  forgot_password_url,
 *  login_url,
 *  logout_url,
 *  reset_password_url,
 *  signup_url,
 *  upload_avatar_url,
 *  user_url,
 *  verify_email_url
 * }>>}
 */
const getRoutes = (() => {
    return async function (replaces = {}) {
        const { data } = await getInfo();

        const routes = {
            avatar_url: data.avatar_url,
            current_user_url: data.current_user_url,
            forgot_password_url: data.forgot_password_url,
            login_url: data.login_url,
            logout_url: data.logout_url,
            reset_password_url: data.reset_password_url,
            signup_url: data.signup_url,
            upload_avatar_url: data.upload_avatar_url,
            user_url: data.user_url,
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

function deleteLocalUser() {
    localStorage.removeItem(LOCALSTORAGE.USER_DATA);
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
                updated_at,
                username,
            } = response.data;

            postMessage(CHANNEL_EVENTS.USER_DATA_UPDATED, { ...response.data });

            if (!response.data) {
                return deleteLocalUser();
            }

            localStorage.setItem(
                LOCALSTORAGE.USER_DATA,
                JSON.stringify({
                    avatar,
                    avatar_url,
                    birth_date,
                    created_at,
                    email,
                    id,
                    role,
                    updated_at,
                    username,
                })
            );

            resolve();
        } catch (err) {
            reject(err);
        }
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

function requestResetPassword() {
    return new Promise(async (resolve, reject) => {
        const routes = await getRoutes().catch(reject);

        axios
            .post(routes.forgot_password_url, DEFAULT_OPTIONS_AXIOS)
            .then(resolve)
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

function getMyGames() {
    return new Promise(async (resolve, reject) => {
        axios.get('games/my', DEFAULT_OPTIONS_AXIOS).then(resolve).catch(reject);
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
