import closest from 'closest';

function addOrRemoveElementClass(el, result, className) {
  if (result) {
    el.classList.remove(className);
  } else {
    el.classList.add(className);
  }

  return result;
}

function checkFieldText(input) {
  const regExp = new RegExp(input.dataset.checkPattern, 'gi');
  const result = regExp.test(input.value);
  const errorClass = 'field-text--error';
  const parentEl = closest(input, '.field-text');

  return addOrRemoveElementClass(parentEl, result, errorClass);
}

function checkFieldCheckbox(input) {
  const trueVal = input.dataset.checkState === 'on';
  const result = trueVal === input.checked;
  const errorClass = 'field-checkbox__input-wrap--error';
  const parentEl = closest(input, '.field-checkbox__input-wrap');

  return addOrRemoveElementClass(parentEl, result, errorClass);
}

// Для всех форм страницы
const forms = Array.from(document.querySelectorAll('form[data-check-form]'));
forms.forEach((form) => {
  // Подпишемся на событие отправки
  form.addEventListener('submit', (e) => {
    let valid = true;
    // Проверим все текстовые инпуты
    const fieldsText = Array.from(
      form.querySelectorAll('input[data-check-pattern]'),
    );
    fieldsText.forEach((input) => {
      if (!checkFieldText(input)) valid = false;
    });
    // Проверим все чекбоксы
    const fieldsCheckbox = Array.from(
      form.querySelectorAll('input[data-check-state]'),
    );
    fieldsCheckbox.forEach((input) => {
      if (!checkFieldCheckbox(input)) valid = false;
    });
    // Если были ошибки, не отправляем форму
    if (!valid) e.preventDefault();
  });
});

// Для всех проверяемых текстовых полей
const fieldsText = Array.from(
  document.querySelectorAll('input[data-check-pattern]'),
);
fieldsText.forEach((input) => {
  let hasBeenAlreadyBlured = false;
  input.addEventListener('blur', () => {
    checkFieldText(input);
    if (!hasBeenAlreadyBlured) hasBeenAlreadyBlured = true;
  });
  input.addEventListener('input', () => {
    if (hasBeenAlreadyBlured) checkFieldText(input);
  });
});

// Для всех проверяемых чекбоксов
const fieldsCheckbox = Array.from(
  document.querySelectorAll('input[data-check-state]'),
);
fieldsCheckbox.forEach((input) => {
  input.addEventListener('change', () => {
    checkFieldCheckbox(input);
  });
});
