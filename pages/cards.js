function createArtApi(config) {
  const url = config.url;
  const headers = config.headers;

  function checkResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject('An error has occurred');
  }

  function getArtObjects() {
    const TOTAL_PAGES = 33;
    const LIMIT_ARTS = 30;
    const randomPage = Math.floor(Math.random() * TOTAL_PAGES) + 1;

    return fetch(
      `${url}api/v1/artworks/search?fields=title,image_id,artist_title&limit=${LIMIT_ARTS}&page=${randomPage}&api_model=artworks`,
      {
        method: 'GET',
        headers: headers,
      }
    )
      .then(checkResponse)
      .catch((error) => {
        console.error('Error in getArtObjects:', error);
      });
  }
  return {
    getArtObjects,
  };
}

const artApi = createArtApi({
  url: 'https://api.artic.edu/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

function addPlayerName() {
  const nameFromStorage = JSON.parse(localStorage.getItem('playerName'));
  const playerNameElement = document.querySelector('#player-name');

  playerNameElement.textContent = nameFromStorage;
}
addPlayerName();

// get cards from API
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
    })

    .finally(() => {
      $('#loading-wrapper').fadeOut('slow', function () {
        countdownContainer.style.display = 'none';
        countdownContainer.style.display = 'block';
        countdownAndRedirect();
      });
    });
}

const cardsContainer = document.querySelector('.gallery');

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

$('#loading-wrapper ').show();

//-------for the timer
const countdownElement = document.getElementById('countdown');
const countdownContainer = document.getElementById('countdown-timer');

function updateCountdown(seconds) {
  countdownElement.textContent = seconds;
}

// Function to start the countdown timer
function startCountdown(durationInSeconds, callback) {
  let remainingTime = durationInSeconds;

  const countdownInterval = setInterval(function () {
    updateCountdown(remainingTime);
    remainingTime--;

    if (remainingTime < 0) {
      clearInterval(countdownInterval);
      callback();
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

// ------Function to handle the countdown and redirect
function countdownAndRedirect() {
  const countdownDuration = 12;
  startCountdown(countdownDuration, redirectToGamePage);
}
