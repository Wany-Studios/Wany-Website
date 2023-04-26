const VOID_CALLBACK = () => { }

const API_ENDPOINT = "http://localhost:3000/";

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