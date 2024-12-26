// Set settings from local storage 
const playerName = document.querySelector('.js-player-name');
const numberOfPlayers = document.querySelector(".js-number-of-players");
const onTheSpot = document.querySelector('.js-on-the-spot');
const getDiceBack = document.querySelector('.js-get-dice-back');
const loserStarts = document.querySelector(".js-loser-starts");
const winnerStarts = document.querySelector('.js-winner-starts');
const getSettings = localStorage.getItem('settings');

if ('settings' in localStorage) {
  JSON.parse(getSettings).playerName != 'Player 1' ? playerName.value = JSON.parse(getSettings).playerName : null;

  numberOfPlayers.innerText = JSON.parse(getSettings).numberOfPlayers;


    if (numberOfPlayers.innerText == 6) {
        document.querySelector(".add").disabled = true;
    }

    if (numberOfPlayers.innerText == 2) {
        document.querySelector(".sub").disabled = true;
    }

    onTheSpot.checked = JSON.parse(getSettings).onTheSpot;

    
    getDiceBack.checked = JSON.parse(getSettings).getDiceBack;

    loserStarts.checked = JSON.parse(getSettings).loserStarts;

    if (!onTheSpot.checked) {
      getDiceBack.disabled = true;

    }

    winnerStarts.checked = !JSON.parse(getSettings).loserStarts;

}

function addOne() {
  document.querySelector(".sub").disabled = false;

  if (numberOfPlayers.innerText < 5) {
    numberOfPlayers.innerText++;
  } else {
    numberOfPlayers.innerText++;
    document.querySelector(".add").disabled = true;
  }
}

function subOne() {
  document.querySelector(".add").disabled = false;

  if (numberOfPlayers.innerText > 3) {
    numberOfPlayers.innerText--;
  } else {
    numberOfPlayers.innerText--;
    document.querySelector(".sub").disabled = true;
  }
}

// save settings
function save() { 
  settings = {
    playerName: playerName.value || null,
    numberOfPlayers: Number(numberOfPlayers.innerText),
    onTheSpot: onTheSpot.checked,
    getDiceBack: getDiceBack.checked,
    loserStarts: loserStarts.checked,
  };
  localStorage.setItem('settings', JSON.stringify(settings));
}

// Get dice back button
function getDiceButton (){
onTheSpot.checked ? getDiceBack.disabled = false : getDiceBack.disabled = true, getDiceBack.checked = false;
}

// // Loser or winner check
function switchToLoser() {
    loserStarts.checked = true;
    winnerStarts.checked = false;
}
function switchToWinner() {
    loserStarts.checked = false;
    winnerStarts.checked = true;
}

