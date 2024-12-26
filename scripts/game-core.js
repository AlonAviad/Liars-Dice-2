import * as ut from "./utils.js";

let game;
;

export function initializeTable() {
  game = ut.loadFromStorage();
  if (!game) {
    return console.log("failed initialize");
  }

  let firstToPlay = Math.floor(Math.random() * game.numberOfPlayers);
  firstToPlay = 1
  return firstToPlay;
};

export function startRound() {
  return new Promise((resolve) => {
  ut.clearBids();
  const game = ut.loadFromStorage();
  game.players.forEach((player) => player.rollDice());
  ut.updateStorage(game);
  console.log("round started");
  resolve();}
  );
}

export function continueRound(start) {
  const game = ut.loadFromStorage();
  for (let i = start || 1; i < game.numberOfPlayers; i++) {
    if (game.players[i].placeBid() === "call") {
      console.log(`player ${i + 1} calls`);
      ut.updateStorage(game);
      return i;
    }
    console.log(`Player ${i + 1} placed bid: ${game.players[i].bid}`);
  }
  ut.updateStorage(game);
  return 0;
  // returns number of player ends round and 0 if game continues
}

export function playerTurn(bid) {
  players[0].bid == bid;
}

export function endRound(callingPlayer) {
  const chalengedPlayer =
    callingPlayer > 0 ? callingPlayer - 1 : numberOfPlayers - 1;
  let winner;
  let loser;

  if (checkWinner(callingPlayer)) {
    winner = callingPlayer;
    loser = chalengedPlayer;
  } else {
    winner = chalengedPlayer;
    loser = callingPlayer;
  }

  if (players[loser].numberOfDice-- == 0) {
    removePlayer(loser);
  }
  startRound(winner); // may start with wrong player -> needs checking
}

function checkWinner(callingPlayer) {
  /*
    returns "true" if calling player wins
  */
}

function EndGame() {}

function removePlayer(i) {
  console.log(`player ${i + 1} removed`);
}

function updateGame() {
  localStorage.setItem("game", JSON.stringify(game));
  console.log("game updated");
}
