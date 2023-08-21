const VOID_CALLBACK = () => {};

function isLocalhost() {
    return location.hostname === 'localhost' || location.hostname === '127.0.0.1';
}

function resolveUrl() {
    return window.location.protocol + '//' + window.location.host + '/';
}

const API_ENDPOINT = isLocalhost() ? '/api/' : 'api.wany.com.br';

const DEFAULT_OPTIONS_AXIOS = {
    withCredentials: true,
    credentials: 'include',
};

function getInfo() {
    return new Promise((resolve, reject) => {
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
    let promise = getInfo();

    return async function (replaces = {}) {
        const { data } = await promise;

        const routes = {
            avatar_url: API_ENDPOINT + data.avatar_url,
            current_user_url: API_ENDPOINT + data.current_user_url,
            forgot_password_url: API_ENDPOINT + data.forgot_password_url,
            login_url: API_ENDPOINT + data.login_url,
            logout_url: API_ENDPOINT + data.logout_url,
            reset_password_url: API_ENDPOINT + data.reset_password_url,
            signup_url: API_ENDPOINT + data.signup_url,
            upload_avatar_url: API_ENDPOINT + data.upload_avatar_url,
            user_url: API_ENDPOINT + data.user_url,
            verify_email_url: API_ENDPOINT + data.verify_email_url,
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
        const routes = await getRoutes().catch(reject);

        axios
            .get(API_ENDPOINT + 'games/my', DEFAULT_OPTIONS_AXIOS)
            .then(resolve)
            .catch(reject);
    });
}
