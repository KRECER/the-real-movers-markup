// eslint-disable-next-line import/no-unresolved
import Swiper from 'swiper/bundle';
// eslint-disable-next-line import/no-unresolved
import 'swiper/css/bundle';

const SliderOption = {
  'services-slider': {},
  'advantages-slider': {
    loop: true,
    autoplay: {
      delay: 3000,
    },
  },
  'team-slider': {
    slidesPerView: 'auto',
    spaceBetween: 90,
  },
};

const sliders = document.querySelectorAll('.js-slider');

sliders.forEach((sliderEl) => {
  const hasCounter = Boolean(sliderEl.querySelector('.js-slides-counter'));
  const { sliderName } = sliderEl.dataset;
  const sliderOptions = SliderOption[sliderName];
  const buttonPrevEl = sliderEl.querySelector('.swiper-button-prev');
  const buttonNextEl = sliderEl.querySelector('.swiper-button-next');
  const paginationEl = sliderEl.querySelector('.swiper-pagination');
  const swiperEl = sliderEl.querySelector('.swiper');
  const slidesTotalCount = sliderEl.querySelectorAll('.swiper-slide').length;

  const getCorrectNum = (num) => (num <= 9 ? '0' : '') + num;

  if (buttonPrevEl && buttonNextEl) {
    sliderOptions.navigation = { prevEl: buttonPrevEl, nextEl: buttonNextEl };
  }

  if (paginationEl) {
    sliderOptions.pagination = { el: paginationEl };
  }

  if (hasCounter) {
    Object.assign(sliderOptions, {
      on: {
        init() {
          const slidesTotalNumEl = sliderEl.querySelector(
            '.js-slides-total-num',
          );
          slidesTotalNumEl.textContent = getCorrectNum(slidesTotalCount);
        },
        slideChange(swiper) {
          const currentSlideNumEl = sliderEl.querySelector(
            '.js-current-slide-num',
          );
          const idx = swiper.realIndex + 1;
          currentSlideNumEl.textContent = `${getCorrectNum(idx)}/`;
        },
      },
    });
  }

  // eslint-disable-next-line no-new
  new Swiper(swiperEl, sliderOptions);
});
