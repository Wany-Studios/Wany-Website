getMe().catch(() => {
    window.location.href = resolveUrl() + 'signin/';
});

let user = getLocalUser();
const saveBtnEl = document.getElementById('buttonSave');
const cancelBtnEl = document.getElementById('buttonCancel');
const bioTextareaEl = document.getElementById('BioTextArea');
const buttonsDivEl = document.querySelector('.section__div--buttons');
const profileImgEl = document.getElementById('profile-picture');
const usernameEl = document.getElementById('User-name');
const emailEl = document.getElementById('User-nickname');

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
