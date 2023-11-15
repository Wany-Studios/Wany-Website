const profileDescriptionDisplay = document.getElementById('BioTextArea');

profileDescriptionDisplay.setAttribute('disabled', 'disabled');

function showProfileDescription() {
    document.querySelector('.section__div--buttons').style.display = 'flex';
    profileDescriptionDisplay.removeAttribute('disabled', '');
}

document.querySelector('button#buttonSave').addEventListener('click', function () {
    document.querySelector('.section__div--buttons').style.display = 'none';
    profileDescriptionDisplay.setAttribute('disabled', 'disabled');
});

document.querySelector('button#buttonCancel').addEventListener('click', function () {
    document.querySelector('.section__div--buttons').style.display = 'none';
    profileDescriptionDisplay.setAttribute('disabled', 'disabled');
});
