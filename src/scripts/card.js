// Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content.querySelector(".places__item");
const placesWrap = document.querySelector(".places__list");

// Функция создания элемента карточки
function createCardElement({ data, onDelete, onLike, onViewImage }) {
    const { _id, name, link, owner, likes, createdAt } = data;
    const storeData = JSON.parse(sessionStorage.getItem('userData'));

    const cardElement = cardTemplate.cloneNode(true);
    const deleteButton = cardElement.querySelector(".card__delete-button");
    const likeButton = cardElement.querySelector(".card__like-button");
    const cardImage = cardElement.querySelector(".card__image");
    const countLike = cardElement.querySelector(".card__like-count");

    cardImage.src = link;
    cardImage.alt = name;
    countLike.textContent = likes.length;

    cardElement.querySelector(".card__title").textContent = name;
    cardElement.setAttribute('data-card-id', _id);
    cardElement._cardInfo = data;

    deleteButton.addEventListener("click", onDelete);
    likeButton.addEventListener("click", onLike);

    if (typeof onViewImage === "function") {
        cardImage.addEventListener("click", onViewImage);
    }

    if (likes.some((user) => user._id === storeData._id)) {
        likeButton.classList.add("card__like-button--active");
    }

    if (owner._id !== storeData._id) {
        deleteButton.remove();
    } else {
        deleteButton.addEventListener("click", onDelete);
    }

    return cardElement;
}

// Функция удаления карточки
export function handleDeleteCard(evt) {
    const cardElement = evt.target.closest('.card');

    cardElement.remove();
}

// Обработчик лайка
export function handleActiveLike(evt, response) {
    const cardElement = evt.target.closest('.card');
    if (!cardElement) return;

    const buttonLike = cardElement.querySelector('.card__like-button');
    const countLike = cardElement.querySelector('.card__like-count');

    cardElement._cardInfo = response;
    buttonLike.classList.toggle('card__like-button--active');
    countLike.textContent = response.likes.length;
}

// Функция создания карточки
export function createCard({ data, handleDeleteCard, handleActiveLike, handleViewImage }) {
    placesWrap.prepend(createCardElement({
        data,
        onDelete: handleDeleteCard,
        onLike: handleActiveLike,
        onViewImage: handleViewImage
    }));
}