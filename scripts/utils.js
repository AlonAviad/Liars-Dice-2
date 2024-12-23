import { Game } from "./classes.js";
const numberOfDice = document.querySelector(".number");
const game = loadFromStorage();
const numberOfPlayers = game.numberOfPlayers;
let chosenDie = null;

export function convertDiceType(die) {
    const dice = ["one", "two", "three", "four", "five", "six"];
    if (typeof die == "string") {
      return dice.indexOf(die) + 1
    } else if (typeof die == "number") {
      return dice[die - 1];
    }
  }


export function defaultSettings() {
    if (localStorage.getItem('settings') == null) {
      const settings = {
        playerName: 'Player 1',
        numberOfPlayers: 4,
        onTheSpot: false,
        getDiceBack: false,
        loserStarts: false,
      };
      localStorage.setItem('settings', JSON.stringify(settings));
    };
  }
  
export function setPlayers() { // to be changed by positions
  let players = 
    `<img src="/images/table4.jpg" class="table">
    <a class="menu-button exit" href="home.html">x</a>
    <div class="player-grid player1">
    <div class="bid" id="player1-bid"></div>
    <div>
    <img src="/images/cup.png" class="cup-image"/>
    </div>
    <div class="dice-container"></div>
  </div>`;
  for (let i = 2; i <= numberOfPlayers; i++) {
    players +=
      `<div class="player-grid player${i}">
      <div class="bid"></div>
      <div class="cup-container js-player${i}">
        <div class="square-container"></div>
        <div>
        <img src="/images/cup.png" class="cup-image"/>
        </div>
      </div>
      <div class="dice-container"></div>
    </div>`
  };
  document.querySelector('.table-container').innerHTML = players;
}

export function setDiceContainers() {
  for (let i = 2; i <= game.numberOfPlayers; i++) {
    document.querySelector(`.js-player${i}`).querySelector('.square-container').innerHTML = '<div class="square"></div>'.repeat(5);
  };
  }

export function diceCounter () {

}

export function clearTable() {
  // Needs reformat after orginazing cups
  document.querySelector(`.player1`).querySelector(".bid").innerHTML = "";
  document.querySelector(`.player1`).classList.remove("player-turn");
  for (let i = 2; i <= game.numberOfPlayers; i++) {
    document.querySelector(`.player${i}`).querySelector(".bid").innerHTML = "";
    document
      .querySelector(`.player${i}`)
      .querySelector(".dice-container").innerHTML = "";
    document.querySelector(`.js-player${i}`).classList.remove("player-turn");
  }
};


export function placeBid() {
  document.getElementById(
    "player1-bid"
  ).innerHTML = `${numberOfDice.textContent} &#10005 <img src="/images/dice-${chosenDie}.png" class="dice-image padding-left">`;
}



export function findMinBid(die) {
  const lastD = 4;
  const lastQ = 8;
  // const lastD = game.players[numberOfPlayers - 1].bid[1];
  // const lastQ = game.players[numberOfPlayers - 1].bid[0];
  if (lastD == 1) {
    if (die == 1) {
      return lastQ + 1;
    } else {
      return 2 * lastQ + 1;
    }
  } else {
    if (die == 1) {
      return Math.ceil(lastQ / 2);
    } else if (die <= lastD) {
      return lastQ + 1;
    } else {
      return lastQ;
    }
  }
};

export function clearBids() {
  game.players.forEach(player => {
    player.bid = null;    
  });
};

export function addSubButtons() {
  let minBid = findMinBid(chosenDie);
  document.querySelector(".bar-sub").disabled = false;
  document.querySelector(".bar-add").disabled = false;
  if (
    numberOfDice.textContent == 1 ||
    (numberOfDice.textContent == minBid && chosenDie != null) ||
    numberOfDice.textContent == ""
  ) {
    document.querySelector(".bar-sub").disabled = true;
  }
  if (numberOfDice.textContent == game.diceInGame) {
    document.querySelector(".bar-add").disabled = true;
  }
}

export function loadFromStorage() {
  if (!localStorage.getItem('game')) {
    return;
  };
  const savedGame = JSON.parse(localStorage.getItem("game"));
  return Game.fromJSON(savedGame);
}

export function updateStorage(game) {
  localStorage.setItem("game", JSON.stringify(game.toJSON()));
};
//--------------------------------------------------