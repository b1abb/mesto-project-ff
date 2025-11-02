import '../pages/index.css';
import { closeModal, openModal } from "./modal";
import { createCard, handleActiveLike, handleDeleteCard } from "./card";
import { enableValidation, clearValidation } from './validation';
import { apiRequest } from "./api";
import validationSettings from '../validationSettings.json';

// Профиль
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profilePhoto = document.querySelector(".profile__image-photo")

// Модальное окно редактирования профиля
const buttonEditProfile = document.querySelector(".profile__edit-button");
const popupEditProfile = document.querySelector(".popup_type_edit");
const formEditProfile = document.forms["edit-profile"];

// Модальное окно редактирования аватарки пользователя
const popupEditProfilePhoto = document.querySelector(".popup_type_profile_photo");
const formEditProfilePhoto = document.forms["edit-profile-img"];
const buttonEditProfilePhoto = document.querySelector(".profile__image-edit-button");
const inputProfileLink = formEditProfilePhoto.elements['link'];

// Модальное окно добавления карточки
const buttonAddCard = document.querySelector(".profile__add-button");
const popupAddCard = document.querySelector(".popup_type_new-card");
const formAddCard = document.forms["new-place"];
const inputPlaceName = formAddCard.elements["place-name"];
const inputPlaceLink = formAddCard.elements["link"];

// Модальное окно просмотра изображения
const popupViewImage = document.querySelector(".popup_type_image");
const paragraphViewImage = popupViewImage.querySelector(".popup__caption");
const imgViewImage = popupViewImage.querySelector(".popup__image");

// Модальное окно для подтверждения удаления карточки
const popupDeleteCard = document.querySelector(".popup_type_delete_card");
const buttonDeleteCard = popupDeleteCard.querySelector(".popup__button");

// Обработчик ошибки получения данных
const handleResponseError = (error) => {
    console.error(error);
};

// Обработчик для смены кнопки
const toggleButtonLoading = (button, isLoading, loadingText) => {
    if (!button) return;

    if (isLoading) {
        if (!button.dataset.originalText) {
            button.dataset.originalText = button.textContent;
        }

        button.textContent = loadingText;
        button.disabled = true;
        return;
    }

    const original = button.dataset.originalText;
    button.textContent = original ?? 'Сохранить';
    button.disabled = false;
};

// Функция отправки формы для изменения профиля
const handleProfileFormSubmit = (evt) => {
    evt.preventDefault();

    const name = formEditProfile.elements["name"].value;
    const description = formEditProfile.elements["description"].value;
    const buttonSubmit = popupEditProfile.querySelector(".popup__button");
    toggleButtonLoading(buttonSubmit, true, 'Сохранение...');

    apiRequest('users/me', 'PATCH', {
        name,
        about: description
    }).then(handleUserResponse).catch(handleResponseError).finally(() => {
        toggleButtonLoading(buttonSubmit, false, 'Сохранить');
        closeModal(popupEditProfile, () => clearValidation(formEditProfile, validationSettings));
    })
};

// Функция обновления аватарки пользователя
const handleEditProfilePhotoFormSubmit = (evt) => {
    evt.preventDefault();

    const buttonSubmit = popupEditProfilePhoto.querySelector('.popup__button');
    toggleButtonLoading(buttonSubmit, true, 'Сохранение...');

    apiRequest('users/me/avatar', 'PATCH', {
        avatar: inputProfileLink.value
    }).then(handleEditProfilePhotoResponse).catch(handleResponseError).finally(() => {
        toggleButtonLoading(buttonSubmit, false, 'Сохранить');
        closeModal(popupEditProfilePhoto);
    });
};

// Слушатели модального окна редактирования профиля
buttonEditProfile.addEventListener('click', () => {
    formEditProfile.elements["name"].value = profileName.textContent;
    formEditProfile.elements["description"].value = profileDescription.textContent;

    openModal(popupEditProfile, () => clearValidation(formEditProfile, validationSettings));
});
buttonEditProfilePhoto.addEventListener('click', () => {
    openModal(popupEditProfilePhoto, () => clearValidation(formEditProfilePhoto, validationSettings));
});
formEditProfile.addEventListener('submit', handleProfileFormSubmit);
formEditProfilePhoto.addEventListener('submit', handleEditProfilePhotoFormSubmit);

// Функция создания карточки
const handleCardFormSubmit = (evt) => {
    evt.preventDefault();

    const buttonSubmit = popupAddCard.querySelector(".popup__button");
    toggleButtonLoading(buttonSubmit, true, 'Сохранение...');

    apiRequest('cards', 'POST', {
        name: inputPlaceName.value,
        link: inputPlaceLink.value
    }).then(handleAddCardResponse).catch(handleResponseError).finally(() => {
        toggleButtonLoading(buttonSubmit, false, 'Сохранить');
        closeModal(popupAddCard, () => clearValidation(formAddCard, validationSettings));
    });
};

// Слушатели модального окна создания карточки
buttonAddCard.addEventListener('click', function () {
    formAddCard.reset();
    clearValidation(formAddCard, validationSettings);
    openModal(popupAddCard, () => clearValidation(formAddCard, validationSettings));
});
formAddCard.addEventListener('submit', handleCardFormSubmit);

//Функция удаления карточки
const handlePopupDeleteCard = (evt) => {
    const cardElement = evt.target.closest('.card');
    const { _id, owner } = cardElement._cardInfo;
    const storeData = JSON.parse(sessionStorage.getItem('userData'));

    if (owner._id !== storeData._id) {
        console.error('У Вас нет прав на удаление этого элемента');
        return;
    }

    const buttonSubmit = popupDeleteCard.querySelector('.popup__button');
    toggleButtonLoading(buttonSubmit, true, 'Удаление...');

    apiRequest(`/cards/${ _id }`, 'DELETE').then(() => handleDeleteCard(evt)).catch(handleResponseError).finally(() => {
       toggleButtonLoading(buttonSubmit, false, 'Да');
        closeModal(popupDeleteCard);
    });
};

// Обработчик удаления карточки
const handleClickDeleteCard = (evt) => {
    openModal(popupDeleteCard);

    buttonDeleteCard.addEventListener('click', () => handlePopupDeleteCard(evt), { once: true });
};

// Функция просмотра карточки
const handleViewImage = (evt) => {
    const imgElement = evt.target.closest('.card');
    const { link, name } = imgElement._cardInfo;

    paragraphViewImage.textContent = name;
    imgViewImage.src = link;
    imgViewImage.alt = name;

    openModal(popupViewImage);
};


// Обработчик клика лайка
const handleClickButtonLike = (evt) => {
    const cardElement = evt.target.closest('.card');
    if (!cardElement) return;

    const { _id, likes } = cardElement._cardInfo;
    const storedUser = JSON.parse(sessionStorage.getItem('userData'));
    const isLiked = likes.some(({ _id: userId }) => userId === storedUser._id);

    const method = isLiked ? 'DELETE' : 'PUT';

    apiRequest(`cards/likes/${ _id }`, method)
        .then((response) => handleActiveLike(evt, response))
        .catch(handleResponseError);
};

// Обработчик ответа на запрос о пользователе
const handleUserResponse = (response) => {
    const { _id, name, cohort, avatar, about } = response;

    profileName.textContent = name;
    profileDescription.textContent = about;
    profilePhoto.src = avatar;
    profilePhoto.alt = `Фотография профиля: ${ name }`;

    sessionStorage.setItem('userData', JSON.stringify({ _id, name, cohort }));
};

// Обработчик ответа на изменение аватарки пользователя
const handleEditProfilePhotoResponse = (response) => {
    const { name, avatar } = response;

    profilePhoto.alt = name;
    profilePhoto.src = avatar;
}

// Обработчик ответа на запрос получения карточек
const handleCardsResponse = (response) => {
    response.sort((cardA, cardB) => new Date(cardA.createdAt) - new Date(cardB.createdAt))
        .forEach((card) => {
            createCard({
                data: card,
                handleDeleteCard: handleClickDeleteCard,
                handleActiveLike: handleClickButtonLike,
                handleViewImage: handleViewImage,
            });
        });
};

// Обработчик ответа на запрос добавления карточки
const handleAddCardResponse = (response) => {
    createCard({
        data: response,
        handleDeleteCard: handleClickDeleteCard,
        handleActiveLike: handleClickButtonLike,
        handleViewImage: handleViewImage,
    })
};

function runRequests() {
    const requests = [
        apiRequest('users/me').then(handleUserResponse).catch(handleResponseError),
        apiRequest('cards').then(handleCardsResponse).catch(handleResponseError),
    ];

    return Promise.all(requests).then(() => {});
}

enableValidation(validationSettings);

runRequests();