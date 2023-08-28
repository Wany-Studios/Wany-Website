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

    const response = await signIn(data).catch(({ response }) => {
        const { data } = response;
        const { message, statusCode, error } = data;
        if (message.length) showErrorToForm(message);
    });

    if (response && response.data?.user) {
        window.location.href = resolveUrl() + "home/";
    }

    document.body.classList.remove("waiting");
    makingRequest = false;
});

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
