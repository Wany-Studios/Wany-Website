

const email = document.getElementById("email_log");
const username = document.getElementById("user_log");
const password = document.getElementById("pass_log");
const repeatPassword = document.getElementById("repeat_pass_log");
const day = document.getElementById("day_log");
const month = document.getElementById("mes_log");
const year = document.getElementById("year_log");
const form = document.getElementById("form");
const data = new Date();
const full_date = data.getFullYear() + "-" + data.getMonth() + "-" + data.getDay();


function error_alert(title, mensagem) {
    Swal.fire(title, mensagem, 'error');
}

form.onsubmit = (e) => {
    e.preventDefault();

    if (password.value != repeatPassword.value) {
        error_alert("Invalid Password", "Passwords you entered don't match!");
        const nascimento = year.value + "-" + month.value + "-" + day.value;

        const days_birth = full_date - nascimento;
        alert(full_date +"  ---  "+ nascimento);
        const iii = days_birth / (1000 * 60 * 60 *24);

        if(iii >= 0){
            alert("maior de 18");
        }else{
            alert("menor de 18");
        }

    } 
}

