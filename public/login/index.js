import("../global/js/scripts.js");


//DECLARAÇÃO DE VARIÁVEIS
const button = document.getElementById("button");
const email_log = document.getElementById("email_log");
const pass_log = document.getElementById("pass_log");

button.addEventListener('click', sendData());

function sendData(email_log, pass_log){

    if(email_log == "" || pass_log == ""){
        alert("Preencha todos os campos por favor");
        return;
    }

    axios.post(SERVER+"auth/login", ).then(function(response){
        console.log("hello");
    });
}