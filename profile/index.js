getMe().catch(() => {
    window.location.href = resolveUrl() + 'signin/';
});

let user = getLocalUser();

const saveBtnEl = document.getElementById('buttonSave');
const cancelBtnEl = document.getElementById('buttonCancel');
const bioTextareaEl = document.getElementById('BioTextArea');
const buttonsDivEl = document.querySelector('.section__div--buttons');
const buttonUploadGame = document.getElementById('div__button--upload');
const profileImgEl = document.getElementById('profile-picture');
const usernameEl = document.getElementById('User-name');
const emailEl = document.getElementById('User-nickname');
const changeUsernameEl = document.getElementById('change-username');

usernameEl.innerHTML = user.username;
emailEl.innerHTML = user.email;
profileImgEl.src = user.avatar_url;
profileImgEl.addEventListener('click', async () => {
    try {
        await makeUploadUserAvatar();

        Promise.allSettled(
            [500, 1_000, 5_000, 10_000].map(async (time) => {
                setTimeout(() => {
                    // many tries to ensure that user avatar will be updated
                    profileImgEl.src = user.avatar_url;
                }, time);
            })
        );
    } catch (err) {
        alert(err.response?.data?.message || 'Unable to change avatar');
    }
});
bioTextareaEl.value = user.bio;

changeUsernameEl.addEventListener('click', async () => {
    const username = prompt('Please enter your new username');
    if (!username) return;
    try {
        await updateMe({ username });
    } catch (err) {
        alert(err.response?.data?.message || 'Unable to change username');
    } finally {
        usernameEl.innerHTML = username;
        saveLocalUser();
    }
});

const disableBioTextarea = () => {
    bioTextareaEl.removeAttribute('disabled');
};

const enableBioTextarea = () => {
    bioTextareaEl.setAttribute('disabled', 'disabled');
    bioTextareaEl.dataset.cachedValue = '';
};

const showProfileDescription = () => {
    bioTextareaEl.dataset.cachedValue = bioTextareaEl.value;
    buttonsDivEl.style.display = 'flex';
    disableBioTextarea();
};

enableBioTextarea();

buttonUploadGame.addEventListener('click', () => {
    const modal = createModal({
        title: 'Upload Game',
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
        yes: 'Choose file and create',
        cancel: 'Cancel',
        async onYes() {
            const title = modal.el.querySelector('#upload-game-title').value;
            const description = modal.el.querySelector(
                '#upload-game-description'
            ).value;
            const genre = modal.el.querySelector('#upload-game-genre').value;

            try {
                const response = await makeUploadGame({ title, description, genre });

                if (response.status === 201) {
                    alert('Game created successfully!');
                    modal.close();
                }
            } catch (err) {
                console.error(err);
                alert(err.response?.data?.message || 'Unable to create game');
            }
        },
    });

    modal.open();
});

saveBtnEl.addEventListener('click', async () => {
    const bio = bioTextareaEl.value;

    try {
        await updateMe({ bio });
    } catch (err) {
        alert(err.response?.data?.message || 'Unable to update user');
    }

    await saveLocalUser();

    buttonsDivEl.style.display = 'none';
    enableBioTextarea();

    user = getLocalUser();
});

cancelBtnEl.addEventListener('click', () => {
    bioTextareaEl.value = bioTextareaEl.dataset.cachedValue;
    buttonsDivEl.style.display = 'none';
    enableBioTextarea();
});
