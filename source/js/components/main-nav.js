function getParents(elem, selector) {
  // Element.matches() polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function (s) {
        const matches = (this.document || this.ownerDocument).querySelectorAll(
          s,
        );
        let i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {} // eslint-disable-line
        return i > -1;
      };
  }

  // Setup parents array
  const parents = [];

  // Get matching parent elements
  // eslint-disable-next-line no-param-reassign
  for (; elem && elem !== document; elem = elem.parentNode) {
    // Add matching parents to array
    if (selector) {
      if (elem.matches(selector)) {
        parents.push(elem);
      }
    } else {
      parents.push(elem);
    }
  }

  return parents;
}

// Добавление/удаление модификаторов при фокусировке на ссылочном элементе
const linkClassName = 'main-nav__link';
const linkClassNameShowChild = 'main-nav__item--show-child';
const findLinkClassName = new RegExp(linkClassName);
// Слежение за всплывшим событием focus (нужно добавить класс, показывающий потомков)
document.addEventListener(
  'focus',
  (event) => {
    // Если событие всплыло от одной из ссылок гл. меню
    if (findLinkClassName.test(event.target.className)) {
      // Добавим классы, показывающие списки вложенных уровней, на всех родителей
      const parents = getParents(event.target, '.main-nav__item');
      for (let i = 0; i < parents.length; i += 1) {
        parents[i].classList.add(linkClassNameShowChild);
      }
    }
  },
  true,
);
// Слежение за всплывшим событием blur (нужно убрать класс, показывающий потомков)
document.addEventListener(
  'blur',
  (event) => {
    // Если событие всплыло от одной из ссылок гл. меню
    if (findLinkClassName.test(event.target.className)) {
      // Уберем все классы, показывающие списки 2+ уровней
      const parents = document.querySelectorAll(`.${linkClassNameShowChild}`);
      for (let i = 0; i < parents.length; i += 1) {
        parents[i].classList.remove(linkClassNameShowChild);
      }
    }
  },
  true,
);
