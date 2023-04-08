// fazer requisição de login
async function makeLoginRequest(usernameOrEmail, password) {
    const response = await fetch(SERVER + "auth/signin", {
        body: JSON.stringify({
            usernameOrEmail,
            password
        }),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: "POST",
        credentials: "include"
    });

    if (!response.ok) {
        try {
            const { code, message, errors } = await response.json();
            const [messageName, messageText] = message.split("|");

            return handleResponseError(messageName, messageText);
        }
        catch (err) {

            throw new Error("Não foi possível completar o login");
        }
    }

    return await response.json();
}

// obtém campos do formulário
function getFormData() {
    const usernameOrEmail = document.getElementById("usernameOrEmail").value;
    const password = document.getElementById("password").value;

    return {
        usernameOrEmail,
        password
    }
}

async function test() {
    return await fetch(SERVER + "info", {
        body: JSON.stringify({
            usernameOrEmail,
            password
        }),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: "POST",
        credentials: "include"
    });
}

document.querySelector("form").onsubmit = async function (e) {
    e.preventDefault();

    const { password, usernameOrEmail } = getFormData();
    const data = await makeLoginRequest(usernameOrEmail, password);

    // receebe a resposta arqui
    console.log({ data })
}
