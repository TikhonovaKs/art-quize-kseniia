const startButton = document.querySelector('#button-start');
const popup = document.querySelector('.popup');
const closePopupButton = document.querySelector('.popup__button-close');
const addNameForm = document.querySelector('.popup__form');
const sendNameButton = document.querySelector('#button-send-name');
const nameInput = document.querySelector('#input-name');

// Open and close popup:
function openPopup() {
  popup.classList.add('popup_is-opened');
}

function closePopup() {
  popup.classList.remove('popup_is-opened');
}

startButton.addEventListener('click', openPopup);
closePopupButton.addEventListener('click', closePopup);

// Form "add name"
function setPopupButtonState(isValid) {
  if (isValid) {
    sendNameButton.removeAttribute('disabled');
    sendNameButton.classList.remove('button_disabled');
  } else {
    sendNameButton.setAttribute('disabled', true);
    sendNameButton.classList.add('button_disabled');
  }
}
addNameForm.addEventListener('input', function () {
  const isValid = nameInput.value.length > 0;

  setPopupButtonState(isValid);
});
addNameForm.addEventListener('submit', function (event) {
  event.preventDefault();

  localStorage.setItem('playerName', JSON.stringify(nameInput.value));

  setPopupButtonState(false);
  addNameForm.reset();
  closePopup();

  // Redirect to cards page
  window.location.href = 'cards.html';
});

