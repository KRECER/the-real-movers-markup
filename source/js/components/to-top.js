import animate from '@utils/animate';

function visibilityToggle() {
  if (window.pageYOffset >= 500) {
    document.getElementById('to-top').classList.add('to-top--visible');
  } else {
    document.getElementById('to-top').classList.remove('to-top--visible');
  }
}

if (document.getElementById('to-top')) {
  document.getElementById('to-top').addEventListener(
    'click',
    (e) => {
      e.preventDefault();
      const scroll = window.pageYOffset;
      const targetTop = 0;
      const scrollDiff = (scroll - targetTop) * -1;
      animate({
        duration: 500,
        timing(timeFraction) {
          return timeFraction ** 4; // https://learn.javascript.ru/js-animation
        },
        draw(progress) {
          const scrollNow = scroll + progress * scrollDiff;
          window.scrollTo(0, scrollNow);
        },
      });
    },
    false,
  );

  window.addEventListener('scroll', visibilityToggle);
  visibilityToggle();
}
