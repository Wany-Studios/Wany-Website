getMe().catch(() => {
    window.location.href = resolveUrl() + "signin/";
});

let user = getLocalUser();

const saveBtnEl = document.getElementById("buttonSave");
const cancelBtnEl = document.getElementById("buttonCancel");
const bioTextareaEl = document.getElementById("BioTextArea");
const buttonsDivEl = document.querySelector(".section__div--buttons");
const buttonUploadGame = document.getElementById("div__button--upload");
const profileImgEl = document.getElementById("profile-picture");
const usernameEl = document.getElementById("User-name");
const emailEl = document.getElementById("User-nickname");
const changeUsernameEl = document.getElementById("change-username");
const changePasswordEl = document.getElementById("change-password");

getUserAvatarUrl(user.username).then((url) => (profileImgEl.src = url));

usernameEl.innerHTML = user.username;
emailEl.innerHTML = user.email;
bioTextareaEl.value = user.bio;

profileImgEl.addEventListener("click", async () => {
    document.body.classList.add("waiting");
    try {
        await makeUploadUserAvatar();
        profileImgEl.src = user.avatar_url + "?t=" + new Date().getTime();
    } catch (err) {
        await alert(err.response?.data?.message || "Unable to change avatar");
    } finally {
        document.body.classList.remove("waiting");
    }
});

changeUsernameEl.addEventListener("click", async () => {
    const username = await prompt("Please enter your new username", user.username);

    if (!username || username.trim() === user.username) return;

    document.body.classList.add("waiting");
    try {
        await updateMe({ username });
    } catch (err) {
        await alert(err.response?.data?.message || "Unable to change username");
        return;
    } finally {
        document.body.classList.remove("waiting");
    }

    usernameEl.innerHTML = username;
    saveLocalUser();
});

const disableBioTextarea = () => {
    bioTextareaEl.removeAttribute("disabled");
};

const enableBioTextarea = () => {
    bioTextareaEl.setAttribute("disabled", "disabled");
    bioTextareaEl.dataset.cachedValue = "";
};

const showProfileDescription = () => {
    bioTextareaEl.dataset.cachedValue = bioTextareaEl.value;
    buttonsDivEl.style.display = "flex";
    disableBioTextarea();
};

const deleteAccount = async () => {
    if (!(await confirm("Are you sure you want to delete your account?"))) return;
    if (!(await confirm("Your account will be permanently deleted."))) return;

    document.body.classList.add("waiting");
    try {
        await deleteUser();
        deleteLocalUser();
        window.location.href = resolveUrl() + "home";
    } catch (err) {
        await alert(err.response?.data?.message || "Unable to delete account");
    } finally {
        document.body.classList.remove("waiting");
    }
};

buttonUploadGame.addEventListener("click", () => {
    let gameImage = null;

    const modal = createModal({
        title: "Upload Game",
        body: `
            <section style="height:100%;display:grid;place-items:center;">
                <form style="width:100%;">
                    <div class="form-group">
                        <span class="form-label">Title</span>
                        <input id="upload-game-title" type="text" class="input" value="" />
                    </div>

                    <div class="form-group">
                        <span class="form-label">Description</span>
                        <textarea id="upload-game-description" type="text" class="input" value="" style="resize:vertical;max-height:200px;"></textarea>
                    </div>

                    <div class="form-group">
                        <span>Game image</span>
                        <button id="select-game-image" type="button">Select game image</button>
                        <img id="upload-game-image" src="" style="max-width:100%;max-height:200px;margin-top:5px;margin-bottom:5px;" />
                        <button id="upload-game-image-delete" type="button" class="secondary" style="display:none;">Remove game image</button>
                    </div>

                    <div class="form-group">
                        <span class="form-label">Name</span>
                        <select id="upload-game-genre" class="input">
                            <option value="Action">Action</option>
                            <option value="Horror">Horror</option>
                            <option value="Terror">Terror</option>
                            <option value="Adventure">Adventure</option>
                        </select>
                    </div>
                </form>
            </section>
        `,
        yes: "Choose file and create",
        cancel: "Cancel",
        async onYes() {
            const title = modal.el.querySelector("#upload-game-title").value;
            const description = modal.el.querySelector(
                "#upload-game-description"
            ).value;
            const genre = modal.el.querySelector("#upload-game-genre").value;

            if (!gameImage) {
                await alert("You must provide an image");
                return;
            }

            document.body.classList.add("waiting");
            try {
                const response = await makeUploadGame({ title, description, genre });

                if (response.status === 201) {
                    if (gameImage) {
                        const { game } = response.data;

                        for (
                            let uploadImageTry = 0;
                            uploadImageTry < 3;
                            uploadImageTry++
                        ) {
                            try {
                                await uploadGameImage({
                                    gameId: game.id,
                                    file: gameImage,
                                    isCover: true,
                                });

                                break;
                            } catch (err) {}
                        }
                    }

                    modal.close();
                }
            } catch (err) {
                console.error(err);
                await alert(err.response?.data?.message || "Unable to create game");
                return;
            } finally {
                document.body.classList.remove("waiting");
            }

            await alert("Game created successfully!");

            window.location.reload();
        },
    });

    const imgEl = modal.el.querySelector("#upload-game-image");
    const imgDeleteEl = modal.el.querySelector("#upload-game-image-delete");
    const imgSelectEl = modal.el.querySelector("#select-game-image");

    imgSelectEl.onclick = async () => {
        const fileList = await getImageInput();
        const fileReader = new FileReader();
        fileReader.onload = () => (imgEl.src = fileReader.result);
        fileReader.readAsDataURL(fileList[0]);
        imgDeleteEl.style.display = "";
        imgSelectEl.style.display = "none";
        gameImage = fileList[0];
    };

    imgDeleteEl.onclick = async () => {
        gameImage = null;
        imgEl.src = "";
        imgDeleteEl.style.display = "none";
        imgSelectEl.style.display = "";
    };

    modal.open();
});

saveBtnEl.addEventListener("click", async () => {
    const bio = bioTextareaEl.value;

    document.body.classList.add("waiting");
    try {
        await updateMe({ bio });
    } catch (err) {
        await alert(err.response?.data?.message || "Unable to update user");
    } finally {
        document.body.classList.remove("waiting");
    }

    await saveLocalUser();

    buttonsDivEl.style.display = "none";
    enableBioTextarea();

    user = getLocalUser();
});

cancelBtnEl.addEventListener("click", () => {
    bioTextareaEl.value = bioTextareaEl.dataset.cachedValue;
    buttonsDivEl.style.display = "none";
    enableBioTextarea();
});

changePasswordEl.addEventListener("click", async () => {
    const changePassword = async () => {
        const password = await prompt("Please enter your new password");

        if (!password) return;

        document.body.classList.add("waiting");
        try {
            await updateMe({ password });
        } catch (err) {
            await alert(err.response?.data?.message || "Unable to change password");

            if (err.response.status === 400) {
                await changePassword();
                return;
            }

            return;
        } finally {
            document.body.classList.remove("waiting");
        }

        await alert("Password changed successfully!");
    };

    await changePassword();
});

async function init() {
    enableBioTextarea();

    document.body.classList.add("waiting");
    try {
        const response = await getMyGames();

        if (!response.status == 200) return;

        const games = response.data.games;
        const lista = generateListCardGames(games);

        document.getElementById("my-games-carousel-list").innerHTML = "";

        lista.forEach((render) => {
            document.getElementById("my-games-carousel-list").appendChild(render());
        });
    } catch (err) {
        await alert(err.response?.data?.message || "Unable to get your games");
        return;
    } finally {
        document.body.classList.remove("waiting");
    }
}

init();
