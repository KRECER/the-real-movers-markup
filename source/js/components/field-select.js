import Choices from 'choices.js';
// Включим на каком-то конкретном отдельно
// const choices = new Choices('#some-if', {/* options */});

// Или тупо найдём все селекты и включим на них Choices
const selects = document.querySelectorAll('.field-select__select');
selects.forEach((item) => {
  // eslint-disable-next-line no-new
  new Choices(item, {
    searchEnabled: false,
    placeholderValue: 'Выберите',
  });
});
