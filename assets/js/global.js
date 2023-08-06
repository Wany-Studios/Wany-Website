const VOID_CALLBACK = () => { }

function isLocalhost() {
    return location.hostname === "localhost" || location.hostname === "127.0.0.1";
}

const API_ENDPOINT = isLocalhost() ? "/api/" : "api.wany.com.br";

const DEFAULT_OPTIONS_AXIOS = {
    withCredentials: true,
    credentials: 'include'
}

function getInfo() {
    return new Promise((resolve, reject) => {
        axios.get(API_ENDPOINT, DEFAULT_OPTIONS_AXIOS)
            .then(resolve)
            .catch(reject);
    });
}


function logout() {
    return new Promise((resolve, reject) => {
        axios.delete(API_ENDPOINT + "auth/logout", DEFAULT_OPTIONS_AXIOS)
            .then(resolve)
            .catch(reject);
    });
}

function getMyGames() {
    return new Promise((resolve, reject) => {
        axios.get(API_ENDPOINT + "games/my", DEFAULT_OPTIONS_AXIOS)
            .then(resolve)
            .catch(reject);
    });
}
