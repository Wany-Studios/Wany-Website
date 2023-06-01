let makingRequest = false;

document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();

    if (makingRequest) return;

    const data = getFormData();

    showErrorToForm();
    if (!validateData(data)) return;

    makingRequest = true;
    document.body.classList.add("waiting");

    const response = await sendData(data).catch(({ response }) => {
        const { status, data } = response;

        if ([400, 401, 404].includes(status)) {
            const { message } = data;
            showErrorToForm(message);
            return;
        }

        showErrorToForm("Unable to complete the registration", 8_000);
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
    if (data.repeatPassword !== data.password) {
        showErrorToForm("Passwords don't match", 5000);
        return false;
    }

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
