getMe().catch(() => {
    window.location.href = resolveUrl() + 'signin/';
});

let user = getLocalUser();
const saveBtn = document.getElementById('buttonSave');
const cancelBtn = document.getElementById('buttonCancel');
const bioTextarea = document.getElementById('BioTextArea');
const buttonsDiv = document.querySelector('.section__div--buttons');
const profileImg = document.getElementById('profile-picture');

profileImg.src = user.avatar_url;
profileImg.addEventListener('click', async () => {
    try {
        await makeUploadUserAvatar();

        setTimeout(() => {
            profileImg.src = user.avatar_url;
        }, 2_500);
    } catch (err) {
        alert(err.response?.data?.message || 'Unable to change avatar');
    }
});
bioTextarea.value = user.bio;

const disableBioTextarea = () => {
    bioTextarea.removeAttribute('disabled');
};

const enableBioTextarea = () => {
    bioTextarea.setAttribute('disabled', 'disabled');
    bioTextarea.dataset.cachedValue = '';
};

const showProfileDescription = () => {
    bioTextarea.dataset.cachedValue = bioTextarea.value;
    buttonsDiv.style.display = 'flex';
    disableBioTextarea();
};

enableBioTextarea();

saveBtn.addEventListener('click', async () => {
    const bio = bioTextarea.value;

    try {
        await updateMe({ bio });
    } catch (err) {
        alert(err.response?.data?.message || 'Unable to update user');
    }

    await saveLocalUser();

    buttonsDiv.style.display = 'none';
    enableBioTextarea();

    user = getLocalUser();
});

cancelBtn.addEventListener('click', () => {
    bioTextarea.value = bioTextarea.dataset.cachedValue;
    buttonsDiv.style.display = 'none';
    enableBioTextarea();
});

const userData = getLocalUser();
