// Set settings from local storage 
if ('settings' in localStorage) {
    document.querySelector('.js-player-name').value = JSON.parse(localStorage.getItem('settings')).playerName

    document.querySelector(".js-number-of-players").innerText = JSON.parse(localStorage.getItem('settings')).numerOfPlayers;


    if (document.querySelector(".js-number-of-players").innerText == 6) {
        document.querySelector(".add").disabled = true;
    }

    if (document.querySelector(".js-number-of-players").innerText == 2) {
        document.querySelector(".sub").disabled = true;
    }

    document.querySelector('.js-on-the-spot').checked = JSON.parse(localStorage.getItem('settings')).onTheSpot;

    
    document.querySelector('.js-get-dice-back').checked = JSON.parse(localStorage.getItem('settings')).getDiceBack;

    document.querySelector('.js-loser-starts').checked = JSON.parse(localStorage.getItem('settings')).loserStarts;

    if (!document.querySelector('.js-on-the-spot').checked) {
      document.querySelector('.js-get-dice-back').disabled = true;

    }

    document.querySelector('.js-winner-starts').checked = !JSON.parse(localStorage.getItem('settings')).loserStarts;

}

function addOne() {
  document.querySelector(".sub").disabled = false;

  if (document.querySelector(".js-number-of-players").innerText < 5) {
    document.querySelector(".js-number-of-players").innerText++;
  } else {
    document.querySelector(".js-number-of-players").innerText++;
    document.querySelector(".add").disabled = true;
  }
}

function subOne() {
  document.querySelector(".add").disabled = false;

  if (document.querySelector(".js-number-of-players").innerText > 3) {
    document.querySelector(".js-number-of-players").innerText--;
  } else {
    document.querySelector(".js-number-of-players").innerText--;
    document.querySelector(".sub").disabled = true;
  }
}

// save settings
function save() { 
  settings = {
    playerName: document.querySelector(".js-player-name").value || null,
    numerOfPlayers: document.querySelector(".js-number-of-players").innerText,
    onTheSpot: document.querySelector(".js-on-the-spot").checked,
    getDiceBack: document.querySelector(".js-get-dice-back").checked,
    loserStarts: document.querySelector(".js-loser-starts").checked,
  };
  localStorage.setItem('settings', JSON.stringify(settings));
}

// Get dice back button
function getDiceButton (){
document.querySelector(".js-on-the-spot").checked ? document.querySelector(".js-get-dice-back").disabled = false : document.querySelector(".js-get-dice-back").disabled = true, document.querySelector(".js-get-dice-back").checked = false;
}

// // Loser or winner check
function switchToLoser() {
    document.querySelector(".js-loser-starts").checked = true;
    document.querySelector(".js-winner-starts").checked = false;
}
function switchToWinner() {
    document.querySelector(".js-loser-starts").checked = false;
    document.querySelector(".js-winner-starts").checked = true;
}

