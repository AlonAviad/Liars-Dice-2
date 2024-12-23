const numberOfPlayers = JSON.parse(localStorage.getItem('settings')).numberOfPlayers;
const moves = JSON.parse(localStorage.getItem('game')).moves;
const numberOfDice = document.querySelector(".number");
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
  for (let i = 2; i <= numberOfPlayers; i++) {
    document.querySelector(`.js-player${i}`).querySelector('.square-container').innerHTML = '<div class="square"></div>'.repeat(5);
  };
  }

export function diceCounter () {

}

export function clearTable() {
  // Needs reformat after orginazing cups
  document.querySelector(`.player1`).querySelector(".bid").innerHTML = "";
  document.querySelector(`.player1`).classList.remove("player-turn");
  for (let i = 2; i <= numberOfPlayers; i++) {
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
  const lastD = moves[numberOfPlayers - 2][1];
  const lastQ = moves[numberOfPlayers - 2][0];
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
  players.forEach(player => {
    player.bid = null;    
  });
};

//--------------------------------------------------