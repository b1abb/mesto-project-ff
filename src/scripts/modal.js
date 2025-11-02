// Обработчик открытия модального окна
export function openModal(popup, onClose) {
    popup.classList.add("popup_is-opened");
    addEventListenersPopup(popup, onClose);
}

// Обработчик закрытия модального окна
export function closeModal(popup, onClose) {
    popup.classList.remove("popup_is-opened");
    removeEventListenersPopup(popup);

    if (typeof onClose === 'function') {
        onClose();
    }
}

// Обработчик условий закрытия
function handleClose(evt, popup, onClose) {
    if (evt.target === popup || evt.target.classList.contains("popup__close") || evt.key === "Escape") {
        closeModal(popup, onClose);
    }
}

// Функция добавления слушателей событий
function addEventListenersPopup(popup, onClose) {
    popup._closeHandler = (evt) => handleClose(evt, popup, onClose);
    popup._keydownHandler = (evt) => handleClose(evt, popup, onClose);

    popup.addEventListener('mousedown', popup._closeHandler);
    document.addEventListener('keydown', popup._keydownHandler);
}

// Функция удаления слушателей событий
function removeEventListenersPopup(popup) {
    popup.removeEventListener('mousedown', popup._closeHandler);
    document.removeEventListener('keydown', popup._keydownHandler);

    delete popup._closeHandler;
    delete popup._keydownHandler;
}