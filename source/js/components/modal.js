import getScrollSize from '@utils/getScrollSize.js';

const bodyPaddingRightOriginal = parseInt(
  window
    .getComputedStyle(document.body, null)
    .getPropertyValue('padding-right'),
  10,
);
const backdrop = document.createElement('div');

function showModal(targetModalNode) {
  const modalEl = targetModalNode;
  if (document.body.clientHeight - document.documentElement.clientHeight > 0) {
    document.body.style.paddingRight = `${
      bodyPaddingRightOriginal + getScrollSize()
    }px`;
  }
  document.body.classList.add('modal-open');

  modalEl.classList.add('modal--show');
  modalEl.style.display = 'block';
  modalEl.ariaModal = true;
  modalEl.ariaHidden = null;
  modalEl.setAttribute('role', 'dialog');

  backdrop.className = 'modal-backdrop';
  document.body.append(backdrop);
}

function closeAllModals() {
  document.body.classList.remove('modal-open');
  document.body.style.paddingRight = '';

  document.querySelectorAll('.modal').forEach((modal) => {
    modal.classList.remove('modal--show');
    modal.setAttribute('style', 'display: none');
    modal.setAttribute('aria-modal', null);
    modal.setAttribute('aria-hidden', true);
    modal.removeAttribute('role');
  });

  backdrop.remove();
}

document.addEventListener('click', (event) => {
  const target = event.target.closest('a[data-modal], button[data-modal]');

  if (target && target.dataset.modal === 'open') {
    showModal(
      document.getElementById(
        (target.hash || target.dataset.modalTarget).slice(1),
      ),
    );
  }

  if (
    (target && target.dataset.modal === 'close') ||
    event.target.matches('[aria-modal]')
  ) {
    closeAllModals();
  }
});
