class ArtApi {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject('An error has occured');
  }

  getArtObjects() {
    const TOTAL_PAGES = 33;
    const LIMIT_ARTS = 30;
    const randomPage = Math.floor(Math.random() * TOTAL_PAGES) + 1;
    return fetch(
      `${this._url}api/v1/artworks/search?fields=title,image_id,artist_title&limit=${LIMIT_ARTS}&page=${randomPage}&api_model=artworks`,
      {
        method: 'GET',
        headers: this._headers,
      }
    ).then(this._checkResponse);
  }
}

const artApi = new ArtApi({
  url: 'https://api.artic.edu/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

//-------for the timer
const countdownElement = document.getElementById('countdown');
const countdownContainer = document.getElementById('countdown-timer');

function updateCountdown(seconds) {
  countdownElement.textContent = seconds;
}

function addPlayerName() {
  const nameFromStorage = JSON.parse(localStorage.getItem('playerName'));
  const playerNameElement = document.querySelector('#player-name');

  playerNameElement.textContent = nameFromStorage;
}
addPlayerName();

$('#loading-wrapper ').show(); //----puts the loader in to function. shows the loader while fetching from the  api

// get cards from API
const cardsContainer = document.querySelector('.gallery');

function getRandomCards() {
  const currentCardsList = [];

  artApi
    .getArtObjects()
    .then((data) => {
      const filterByNullCardsList = data.data.filter((card) => card.artist_title !== null);

      const first15CardsList = filterByNullCardsList.slice(0, 15);

      first15CardsList.forEach((element) => {
        renderCard(element);
        // Collect every card into currentCardsList array
        currentCardsList.push(element);
      });
      // Save the updated array back to local storage (use for game)
      localStorage.setItem('latestCardsList', JSON.stringify(currentCardsList));
      console.log(currentCardsList);
    })

    .finally(() => {
      $('#loading-wrapper').fadeOut('slow', function () {
        //----the loader stops when the page is ready and fades out.
        countdownContainer.style.display = 'none'; //---- Hides the countdown timer until loading is complete -heidi
        countdownContainer.style.display = 'block'; //----shows timer when loading is comlete and is in the memorization area. -heidi
        countdownAndRedirect(); //----automatically starts the timer when the page is completely loaded -heidi
      });
    });
}

// Render one card
function renderCard(element) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('.card__image').src =
    'https://www.artic.edu/iiif/2/' + element.image_id + '/full/200,/0/default.jpg';
  cardElement.querySelector('.card__author').textContent = element.artist_title;

  cardsContainer.append(cardElement);
}

getRandomCards();

// Function to start the countdown timer
function startCountdown(durationInSeconds, callback) {
  let remainingTime = durationInSeconds;

  const countdownInterval = setInterval(function () {
    updateCountdown(remainingTime);
    remainingTime--;

    if (remainingTime < 0) {
      clearInterval(countdownInterval);
      callback(); // Call the callback function when the countdown is done
    }
  }, 1000);
}

// Function to redirect to the game page
function redirectToGamePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const redirectDone = urlParams.get('redirectDone');

  if (redirectDone !== 'true') {
    const newUrl = new URL('game.html', window.location.href);
    newUrl.searchParams.set('redirectDone', 'true');
    window.location.href = newUrl.toString();
  }
}

// ------Function to handle the countdown and redirect -heidi
function countdownAndRedirect() {
  const countdownDuration = 12;
  startCountdown(countdownDuration, redirectToGamePage);
}

// Redirecting page to game after 12 seconds
const urlParams = new URLSearchParams(window.location.search);
const redirectDone = urlParams.get('redirectDone');
function redirectPage() {
  if (redirectDone !== 'true') {
    setTimeout(function () {
      const newUrl = new URL('game.html', window.location.href);
      newUrl.searchParams.set('redirectDone', 'true');
      window.location.href = newUrl.toString();
    }, 12000);
  }
}

$(document).ready(function () {
  getRandomCards();
});
