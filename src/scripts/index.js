import '../pages/index.css';
import { initialCards } from "./cards";
import { closeModal, openModal } from "./modal";
import { createCard } from "./card";

// DOM узлы
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// Модальное окно редактирования профиля
const buttonEditProfile = document.querySelector(".profile__edit-button");
const popupEditProfile = document.querySelector(".popup_type_edit");
const formEditProfile = document.forms["edit-profile"];

// Модальное окно добавления карточки
const buttonAddCard = document.querySelector(".profile__add-button");
const popupAddCard = document.querySelector(".popup_type_new-card");
const formAddCard = document.forms["new-place"];

// Модальное окно просмотра изображения
const popupViewImage = document.querySelector(".popup_type_image");
const paragraphViewImage = popupViewImage.querySelector(".popup__caption");
const imgViewImage = popupViewImage.querySelector(".popup__image");

// Функция отправки формы
function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    profileName.textContent = formEditProfile.elements["name"].value;
    profileDescription.textContent = formEditProfile.elements["description"].value;

    closeModal(popupEditProfile);
}

// Функция создания карточки
function handleCardFormSubmit(evt) {
    evt.preventDefault();

    const placeName = formAddCard.elements["place-name"].value;
    const link = formAddCard.elements["link"].value;

    createCard({ name: placeName, link }, handleViewImage);
    closeModal(popupAddCard);
    formAddCard.reset();
}

// Функция просмотра карточки
function handleViewImage(evt) {
    imgViewImage.src = evt.target.src;
    imgViewImage.alt = evt.target.alt;
    paragraphViewImage.textContent = evt.target.alt;

    openModal(popupViewImage);
}

// Дефолтное заполнение карточек
initialCards.reverse().forEach((data) => {
    createCard(data, handleViewImage);
});

// Слушатели модального окна редактирования профиля
buttonEditProfile.addEventListener('click', () => {
    formEditProfile.elements["name"].value = profileName.textContent;
    formEditProfile.elements["description"].value = profileDescription.textContent;
    openModal(popupEditProfile);
});
formEditProfile.addEventListener('submit', handleProfileFormSubmit);

// Слушатели модального окна создания карточки
buttonAddCard.addEventListener('click', () => openModal(popupAddCard));
formAddCard.addEventListener('submit', handleCardFormSubmit);