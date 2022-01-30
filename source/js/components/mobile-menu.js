const mobileMenuEl = document.querySelector('#mobile-menu');
const backdropEl = document.querySelector('#backdrop');
const burgerEl = document.querySelector('#burger');

const handleBackdropClick = () => {
  mobileMenuEl.classList.toggle('mobile-menu--opened');
  burgerEl.classList.remove('burger--close');
  document.body.classList.toggle('no-scroll');
};

backdropEl.addEventListener('click', handleBackdropClick);
