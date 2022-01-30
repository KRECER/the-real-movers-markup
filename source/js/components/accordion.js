const accordions = document.querySelectorAll('.js-accordion');

function handleClickAcrd(evt) {
  const parentEl = evt.currentTarget;
  const targetEl = evt.target.parentElement;
  const activeClass = 'accordion__item--opened';

  if (targetEl.classList.contains('accordion__item')) {
    const activeAccordionEl = parentEl.querySelector(`.${activeClass}`);

    targetEl.classList.add(activeClass);

    if (activeAccordionEl) {
      activeAccordionEl.classList.remove(activeClass);
    }
  }
}

accordions.forEach((acrdEl) => {
  acrdEl.addEventListener('click', handleClickAcrd);
});
