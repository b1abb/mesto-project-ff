// Проверка валидации
const isValid = (formElement, inputElement, { inputErrorClass, errorClass }) => {
    if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, { inputErrorClass, errorClass });
    } else {
        hideInputError(formElement, inputElement, { inputErrorClass, errorClass });
    }
};

// Функция активации и деактивации кнопки submit
const toggleSubmit = (formElement, forceReset, { submitButtonSelector, inactiveButtonClass }) => {
    const buttonSave = formElement.querySelector(submitButtonSelector);
    if (!buttonSave) return;
    const isValidForm = forceReset ? false : formElement.checkValidity();
    buttonSave.disabled = !isValidForm;
    buttonSave.classList.toggle(inactiveButtonClass, !isValidForm);
};

// Функция, которая определяет тип ошибки и возвращает ее текст
const messageType = (inputElement) => {
    const valid = inputElement.validity;

    if (valid.patternMismatch) {
        const customMessage = inputElement.getAttribute('data-error-pattern');
        const defaultMessage = 'Значение не соответствует формату.';

        return {
            key: 'patternMismatch',
            message: customMessage || inputElement.validationMessage || defaultMessage,
        };
    }

    return {
        key: 'valid',
        message: inputElement.validationMessage || '',
    };
}

// Функция возвращает спан для вывода ошибки
const findErrorSpan = (formElement, inputElement) => {
    return formElement.querySelector(`.${ inputElement.id }-input-error`);
}

// Функция отображения ошибки
const showInputError = (formElement, inputElement, { inputErrorClass, errorClass }) => {

    const errorSpan = findErrorSpan(formElement, inputElement);
    if (!errorSpan) return;

    const errorObj = messageType(inputElement);

    inputElement.classList.add(inputErrorClass);
    errorSpan.textContent = errorObj.message;
    errorSpan.classList.add(errorClass);
}

// Функция скрытия ошибки
const hideInputError = (formElement, inputElement, { inputErrorClass, errorClass }) => {
    const errorSpan = findErrorSpan(formElement, inputElement);
    if (!errorSpan) return;

    inputElement.classList.remove(inputErrorClass);
    errorSpan.classList.remove(errorClass);
    errorSpan.textContent = '';
};

// Слушатель событий
const setEventListeners = (formElement, {
    formSelector,
    inputSelector,
    submitButtonSelector,
    inactiveButtonClass,
    inputErrorClass,
    errorClass
}) => {
    const settings = {
        formSelector,
        inputSelector,
        submitButtonSelector,
        inactiveButtonClass,
        inputErrorClass,
        errorClass
    }
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));

    toggleSubmit(formElement, false, settings)
    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', () => {
            isValid(formElement, inputElement, {
                inputErrorClass: settings.inputErrorClass,
                errorClass: settings.errorClass
            });
            toggleSubmit(formElement, false, settings)
        });
    });
};

// Функция валидации форм
export function enableValidation({
                                     formSelector,
                                     inputSelector,
                                     submitButtonSelector,
                                     inactiveButtonClass,
                                     inputErrorClass,
                                     errorClass
                                 }) {
    const settings = {
        formSelector,
        inputSelector,
        submitButtonSelector,
        inactiveButtonClass,
        inputErrorClass,
        errorClass
    }
    const formList = Array.from(document.querySelectorAll(settings.formSelector));

    formList.forEach((formElement) => {
        setEventListeners(formElement, settings);
    });
}

// Функция сбрасывания всех ошибок
export function clearValidation(formElement, {
    formSelector,
    inputSelector,
    submitButtonSelector,
    inactiveButtonClass,
    inputErrorClass,
    errorClass
}) {
    const settings = {
        formSelector,
        inputSelector,
        submitButtonSelector,
        inactiveButtonClass,
        inputErrorClass,
        errorClass
    }
    const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector || '.popup__input'));

    inputList.forEach((inputElement) => hideInputError(formElement, inputElement, settings));
    toggleSubmit(formElement, true, settings);
    formElement.reset();
}