let makingRequest = false;

document.querySelector("form").addEventListener("submit", async function (e) {
    e.preventDefault();

    if (makingRequest) return;

    const data = getFormData();

    showErrorToForm();
    if (!validateData(data)) return;

    makingRequest = true;
    document.body.classList.add("waiting");

    const response = await signUp(data).catch(({ response }) => {
        const { data } = response;
        const { message, statusCode, error } = data;
        if (message.length) showErrorToForm(message);
    });

    if (response && response.data?.user) {
        window.location.href = "/home/";
    }

    document.body.classList.remove("waiting");
    makingRequest = false;
});

function signUp(data) {
    return new Promise(async (resolve, reject) => {
        const routes = await getRoutes();

        axios.post(routes.signup_url, { ...data, dateOfBirth: new Date("2000-01-01") }, DEFAULT_OPTIONS_AXIOS)
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
