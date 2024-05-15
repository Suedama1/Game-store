
function toggleForm(formId) {
    const form = document.getElementById(formId);
    const isActive = form.classList.contains('active');
    const forms = document.querySelectorAll('.form-box');
    forms.forEach((f) => {
        f.classList.remove('active');
    });

    document.getElementById('add-game-message').innerText = '';
    document.getElementById('del-plat-success').innerText = '';
    document.getElementById('del-cat-success').innerText = '';
    document.getElementById('del-title-message').innerText = '';
    document.getElementById('add-cat-message').innerText = '';
    document.getElementById('add-plat-message').innerText = '';
    if (!isActive) {
        form.classList.add('active');
    }
}