getMe().catch(() => {
    window.location.href = resolveUrl() + 'signin/';
});

let user = getLocalUser();
let modal;

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
    modal = createModal({
        title: 'Upload Game',
        footer: `
            <div style="display:flex; gap:4px; justify-content: flex-end;">
                <button>Create</button>
                <button class="secondary close-modal">Cancel</button>
            </div>
        `,
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

const userData = getLocalUser();
