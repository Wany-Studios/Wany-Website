const VOID_CALLBACK = () => { }

const API_ENDPOINT = "/api/";

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

function menu_function(e)
{
    let img = document.querySelector("#menu img");
    let menu = document.querySelector(".open");

    document.querySelector(".menu-overlay").classList.toggle("open");
    
    if(!menu){
        document.body.style.overflow = "hidden";
        img.setAttribute("src", "../assets/img/close.png");
    }else{
        document.body.style.overflow = "";
        img.setAttribute("src", "../assets/img/svg/header/menu.svg");
    }
}