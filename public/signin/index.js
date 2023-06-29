let makingRequest = false;

document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();

    if (makingRequest) return;

    showErrorToForm(null);

    const data = getFormData();

    showErrorToForm();
    if (!validateData(data)) return;

    makingRequest = true;
    document.body.classList.add("waiting");

    const response = await sendData(data).catch(({ response }) => {
        const { status, data } = response;
        const { message } = data;
        showErrorToForm(message);
    });

    if (response && response.data?.user) {
        window.location.href = "/home/";
    }

    document.body.classList.remove("waiting");
    makingRequest = false;
});

function sendData(data) {
    return new Promise((resolve, reject) => {
        axios.post(API_ENDPOINT + "auth/signin", data, DEFAULT_OPTIONS_AXIOS)
            .then(resolve)
            .catch(reject);
    });
}

function validateData(data) {
    // TODO: implement this function
    return true;
}

function getFormData() {
    const usernameOrEmail = document.getElementById("username-email").value;
    const password = document.getElementById("password").value;

    return {
        usernameOrEmail,
        password
    }
}
