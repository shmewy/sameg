function showTOS() {
    const tosOverlay = document.getElementById('tos-overlay');
    tosOverlay.style.display = 'flex';
}

function acceptTOS() {
    const tosOverlay = document.getElementById('tos-overlay');
    tosOverlay.style.display = 'none';
    localStorage.setItem('acceptedTOS', 'true');
}

function checkTOS() {
    if (!localStorage.getItem('acceptedTOS')) {
        showTOS();
    }
}