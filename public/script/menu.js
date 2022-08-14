let hamburger = document.querySelector('.hamburger');
let menu = document.querySelector('.menu ul');

hamburger.addEventListener('click', () => {
    menu.classList.toggle('active');
});