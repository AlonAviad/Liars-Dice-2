import { Game } from "./classes.js";

//------------------ GAME INITIALIZATION ---------------------------

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

export function initializeGame() {
  return new Promise((resolve,) => {
    console.log('init');
    defaultSettings();
    if (!localStorage.getItem('game')) {
      console.log("new game started");
        const game = new Game();
        updateStorage(game);
        resolve(game);
      } else {
        resolve(loadFromStorage());
      }
    });
}

//------------------ STORAGE ---------------------------
  
export function loadFromStorage() {
  if (!localStorage.getItem('game')) {
    return;
  };
  const savedGame = JSON.parse(localStorage.getItem("game"));
  return Game.fromJSON(savedGame);
}

export function updateStorage(game) {
  localStorage.setItem("game", JSON.stringify(game.toJSON()));
  console.log("storage updated"); 
}

//------------------ UI AND CORE HELPERS ---------------------------

export function convertDiceType(die) {
  const dice = ["one", "two", "three", "four", "five", "six"];
  if (typeof die == "string") {
    return dice.indexOf(die) + 1
  } else if (typeof die == "number") {
    return dice[die - 1];
  }
}

export function clearBids() {
  const game = loadFromStorage();
  console.log("clear bids")
  game.players.forEach(player => {
    player.bid = null;
  });
  updateStorage(game);
}

export function previousPlayer(playerIndex) {
  const game = loadFromStorage();
  let previousPlayer = (playerIndex + game.numberOfPlayers - 1) % game.numberOfPlayers;
  return previousPlayer;
}

export function findMinBid(die) {
  const game = loadFromStorage();
  if (!game.players[game.numberOfPlayers - 1].bid) {
    return 1;
  }
  const lastD = game.players[game.numberOfPlayers - 1].bid[1];
  const lastQ = game.players[game.numberOfPlayers - 1].bid[0];
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

//------------------ ODDS ---------------------------
// All functions below tested and working as expected

export function bidArray(quantity, series, hand, firstBid = false, best = false) {
  const game = loadFromStorage();
  best = firstBid ? true : best; //  Ensures that if firstBis is true, best is set to true. If firstBid is false, best remains unchanged.
  
  if (series === 1) {
    series = 7;
    quantity = quantity * 2 + 1;
  }
  
  const diceInGame =  game.diceInGame;

  let arrayLength;
  if (firstBid) {
    arrayLength = diceInGame;
  } else if (best) {
    arrayLength = diceInGame * 2 + 1;
  } else {
    arrayLength = 2;
  }
  const bidArray = Array.from({ length: arrayLength }, () => Array(6).fill(0));
  
  for (let currentQuantity = quantity; currentQuantity <= quantity + arrayLength - 1; currentQuantity++) { // array for each quantity
    for (let currentSeries = 0; currentSeries < 6; currentSeries++) { // array for each series of current quantity
      if (currentSeries === 5 && currentQuantity % 2 === 0 && !firstBid) { // leagal bids of 1s
          bidArray[currentQuantity - quantity][5] = calculateOdds(currentQuantity / 2, 1, hand);
      } 
      if ((currentQuantity !== quantity || currentSeries + 2 > series) && currentSeries !== 5) { // leagal bids of 2s-6s
          bidArray[currentQuantity - quantity][currentSeries] = calculateOdds(currentQuantity, currentSeries + 2, hand);
      }
    }
  } 
  console.log(bidArray);
  return bidArray;
}

export function calculateOdds(quantity, series, hand) {
  const game = loadFromStorage();
  const onesCount = hand.filter((die) => die == 1).length;
  const seriesCount = hand.filter((die) => die == series).length;
  let k;
  let p;
  if (series === 1) {
    series = 7
    k = quantity - onesCount;
    p = 1 / 6;
  } else {
    k = quantity - (seriesCount + onesCount);
    p = 1 / 3;
  }
  const n = game.diceInGame - hand.length;
  let odds = 0;
  for (let i = k; i <= n; i++) {
    odds += binomialPMF(i, n, p);
  }
  return odds;
}

function binomialPMF(k, n, p) {
  const binomCoeff = factorial(n) / (factorial(k) * factorial(n - k));
  return binomCoeff * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

function factorial(n) {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

//--------------------------------------------------

