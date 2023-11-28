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

    if (response) {
        await saveLocalUser();
        window.location.href = resolveUrl() + "home/";
    }

    document.body.classList.remove("waiting");
    makingRequest = false;
});

function validateData(data) {
    // TODO: implement this function
    return true;
}

async function forgotPassword() {
    const email = document.getElementById("username-email");

    if (!email.value.length) {
        showErrorToForm("Please, enter your email address.");
        email.focus();
        return;
    }

    if (!email.value.includes("@")) {
        showErrorToForm("You need to provide a valid email.");
        email.focus();
        return;
    }

    showErrorToForm();

    try {
        document.body.classList.add("waiting");
        await requestResetPassword(email.value);
        email.value = "";
        alert("Reset password email has been sent. Check your inbox.");
    } catch (err) {
        showErrorToForm(
            err.response?.data?.message || "Unable to request reset password."
        );
    } finally {
        document.body.classList.remove("waiting");
    }
}

function getFormData() {
    const usernameOrEmail = document.getElementById("username-email").value;
    const password = document.getElementById("password").value;

    return {
        usernameOrEmail,
        password,
    };
}
