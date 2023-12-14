const infoButton = document.querySelector('#button-start');
const closePopupBtn = document.querySelectorAll('#close_btn');
const popupsList = document.querySelectorAll('.popup');
const popupInstruction = document.querySelector('.popup_type_instructions');

// popups
infoButton.addEventListener('click', function () {
  popupInstruction.classList.add('popup_is-opened');
});

function closePopups() {
  popupsList.forEach(function (popup) {
    popup.classList.remove('popup_is-opened');
  });
}

closePopupBtn.forEach(function (button) {
  button.addEventListener('click', closePopups);
});

//-------------------------------------------------------------------------------------------------------------

// Add player name to player's info
function addPlayerName() {
  const nameFromStorage = JSON.parse(localStorage.getItem('playerName'));
  const playerNameElement = document.querySelector('#player-name');
  playerNameElement.textContent = nameFromStorage;
}
addPlayerName();

//-------------------------------------------------------------------------------------------------------------

// Get a current arts list from Local Storage
const artsListFromStorage = JSON.parse(localStorage.getItem('latestCardsList'));

// Get an array of 5 arrays of 3 arts
function getGameArtsList() {
  let cardsOfOneRound = [];
  let cardsOfOneGame = [];

  for (let i = 0; i < artsListFromStorage.length; i++) {
    let artCard = artsListFromStorage[i];
    cardsOfOneRound.push(artCard);

    if (cardsOfOneRound.length === 3) {
      cardsOfOneGame.push(cardsOfOneRound);
      cardsOfOneRound = [];
    }
  }
  return cardsOfOneGame;
}
// Save the game array of cards in a constant
const currentGameArtsArray = getGameArtsList();

//-------------------------------------------------------------------------------------------------------------

const cardsContainer = document.querySelector('.gallery');
// Render one card
function renderCard(element) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.cloneNode(true);
  // add attribute (not visible data, to compare this name with random name)
  cardElement.children[0].setAttribute('data-artisttitle', element.artist_title);

  cardElement.querySelector('.card__image').src =
    'https://www.artic.edu/iiif/2/' + element.image_id + '/full/200,/0/default.jpg';

  addClickCardListener(cardElement);

  cardsContainer.append(cardElement);
}

//-------------------------------------------------------------------------------------------------------------
// variables with initial values
let round = 0;
let score = 0;
let randomArtist = '';
let artistTitle = '';

const artisrElement = document.querySelector('.title__artist');
const playerRound = document.querySelector('#player-round');
const playerScore = document.querySelector('#player-score');
playerRound.textContent = `Round: ${round}`;
playerScore.textContent = `Score: ${score}`;

function renderOneRoundCards() {
  if (round >= 5) {
    cardsContainer.innerHTML = '';
    artisrElement.textContent = '';
    openFeedbackPopup();
    return;
  }
  // Clean card container before rendering a new round
  cardsContainer.innerHTML = '';
  // Save one round array
  const oneRoundCardsArray = currentGameArtsArray[round];
  // Get random artist of 3 cards and render this name
  const randomIndexCard = Math.floor(Math.random() * oneRoundCardsArray.length);
  randomArtist = oneRoundCardsArray[randomIndexCard].artist_title;
  artisrElement.textContent = randomArtist;

  // Render 3 cards
  oneRoundCardsArray.forEach((card) => {
    renderCard(card);
  });
}
renderOneRoundCards();

function addClickCardListener(cardElement) {
  cardElement.children[0].addEventListener('click', function (clickEvent) {
    // Get attribute Artist name
    artistTitle = clickEvent.target.closest('.card').getAttribute('data-artisttitle');
    if (artistTitle === randomArtist) {
      openAnswerResultPopup(true);
      score += 1;
      playerScore.textContent = `Score: ${score}`;
    } else {
      openAnswerResultPopup(false);
    }
    round += 1;
    playerRound.textContent = `Round: ${round}`;
    renderOneRoundCards();
  });
}

const popupAnswerResult = document.querySelector('.popup_type_result');

function openAnswerResultPopup(result) {
  const resultMessage = popupAnswerResult.querySelector('#result-message');
  const realArtist = popupAnswerResult.querySelector('#right-answer');

  popupAnswerResult.classList.add('popup_is-opened');
  if (result === true) {
    resultMessage.innerHTML = '<span style="color: #2f80ed;">You are a genius &#10004;</span>';
    realArtist.textContent = `Yes, it is: ${randomArtist}`;
  } else {
    resultMessage.innerHTML = '<span style="color: red;">Unfortunately no &#10008;</span>';
    realArtist.textContent = `Actually, it is: ${artistTitle}`;
  }
}

//-------------------------------------------------------------------------------------------------------------

// Feedback popup
const popupFeedback = document.querySelector('.popup_type_feedback');
const feedbackTitleEl = popupFeedback.querySelector('#feedback-title');
const feedbackMessageEl = popupFeedback.querySelector('#feedback-massage');
const newGameButton = popupFeedback.querySelector('#newgame-button');
const mainPageButton = popupFeedback.querySelector('#mainpage-button');
let feedbackTitle = '';
let feedbackMessage = '';

newGameButton.addEventListener('click', function () {
  window.location.href = 'cards.html';
});

mainPageButton.addEventListener('click', function () {
  window.location.href = 'index.html';
});

function openFeedbackPopup() {
  popupFeedback.classList.add('popup_is-opened');
  feedbackTitle =
    score === 5
      ? '5 of 5! Congratulations!'
      : score === 4
      ? '4 of 5! Almost perfection!'
      : score === 3
      ? '3 of 5! Impressive!'
      : score === 2
      ? '2 of 5! Well done!'
      : score === 1
      ? '1 of 5! You are on the right track!'
      : '0 of 5! Keep exploring the art world!';
  feedbackMessage =
    score === 5
      ? 'You are a certified Art Master'
      : score === 4
      ? 'Your art expertise is shining through'
      : score === 3
      ? 'You are becoming an Art Master'
      : score === 2
      ? 'Your art knowledge is growing'
      : score === 1
      ? 'Brush up on those art details'
      : 'Do not worry. You are still good';

  feedbackTitleEl.textContent = feedbackTitle;
  feedbackMessageEl.textContent = feedbackMessage;
}
