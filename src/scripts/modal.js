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
function handleConditionClose(evt, popup) {
    if (evt.target === popup || evt.target.classList.contains("popup__close") || evt.key === "Escape") {
        closeModal(popup);
    }
}

// Обработчик нажатия на клавишу
function handleKeydown(evt, popup) {
    if (evt.key === "Escape") {
        handleConditionClose(evt, popup);
    }
}

// Функция добавления слушателей событий
function addEventListenersPopup(popup) {
    popup._closeHandler = (evt) => handleConditionClose(evt, popup);
    popup._keydownHandler = (evt) => handleKeydown(evt, popup);

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