document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = getFormData();

    if (!validateData(data)) {
        // TODO: show validation error to the user
        console.error("Algo é inválido");
        return;
    }

    const response = await sendData(data).catch(VOID_CALLBACK);

    console.log({ response });
});

function sendData(data) {
    return new Promise((resolve, reject) => {
        axios.post(API_ENDPOINT + "auth/signup", data, DEFAULT_OPTIONS_AXIOS)
            .then(resolve)
            .catch(reject);
    });
}

function validateData(data) {
    // TODO: implement this function
    return true;
}

function getFormData() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const repeatPassword = document.getElementById("repeat-password").value;

    return {
        username,
        email,
        password,
        repeatPassword
    }
}
