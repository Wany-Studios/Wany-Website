getMe().catch(() => {
    window.location.href = resolveUrl() + "signin/";
});

document.addEventListener("DOMContentLoaded", async() => {
    const inputs = [...document.querySelectorAll(".verification")];
    const btnSend = document.getElementById("btn-send");

    btnSend.addEventListener("click", async () => {
        await verify();
    });

    inputs.forEach((input, index, arr) => {
        input.addEventListener("input", () => {
            if (index !== arr.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener("keyup", async (event) => {
            input.value = input.value.trim();

            if (event.key === 'Backspace') {
                if (input.value.length === 0 && index !== 0) {
                    inputs[index - 1].value = "";
                    inputs[index - 1].focus();
                }
            }
            else if (event.key === 'Enter') {
                await verify();
            }
        });
    });

    function getValue() {
        return inputs.reduce((result, input) => result + input.value.trim(), "").toUpperCase();
    }

    function checkValue() {
        return getValue().length === inputs.length;
    }

    async function verify() {
        if (!checkValue()) {
            alert("Digite o código completo!");
            return;
        }

        const token = getValue();

        try {
            await verifyAccount(token);
            alert("Your account has been verified");
            window.location.href = resolveUrl() + "home/";
        }
        catch(err) {
            alert("Error: " + err.message);
        }
    }
});










