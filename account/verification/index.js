
document.addEventListener("DOMContentLoaded", () => {
    const inputs = [...document.querySelectorAll(".verification")];
    const btnSend = document.getElementById("btn-send");

    btnSend.addEventListener("click", () => {
        verifyAccount();
    });

    inputs.forEach((input, index, arr) => {
        input.addEventListener("input", () => {
            if (index !== arr.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener("keyup", (event) => {
            input.value = input.value.trim();

            if (event.key === 'Backspace') {
                if (input.value.length === 0 && index !== 0) {
                    inputs[index - 1].value = "";
                    inputs[index - 1].focus();
                }
            }
            else if (event.key === 'Enter') {
                verifyAccount();
            }
        });
    });
    
    function verifyValue() {
        const value = inputs.reduce((result, input) => result + input.value.trim(), "");

        if (value.length !== inputs.length) {
            return false;
        }
        return true;
    }


    function verifyAccount() {
        if (!verifyValue()) {
            alert("Digite o código completo!");
            return;
        }

        alert("Passou pelas verificações!");

    }
});










