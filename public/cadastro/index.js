let makingRequest = false;

document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();

    if (makingRequest) return;

    const data = getFormData();

    if (!validateData(data)) {
        showErrorToForm("Verifique se todos os campos são válidos");
        return;
    }

    makingRequest = true;
    document.body.classList.add("waiting");

    const response = await sendData(data).catch(({ response }) => {
        const { status, data } = response;

        if ([400, 401, 404].includes(status)) {
            const { message } = data;
            showErrorToForm(message);
            return;
        }

        showErrorToForm("Não foi possível realizar o cadastro", 8_000);
    });

    if (response && response.data?.user) {
        window.location.href = "/home/";
    }

    document.body.classList.remove("waiting");
    makingRequest = false;
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
