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
  ut.clearBids();
  const game = ut.loadFromStorage();
  game.players.forEach((player) => player.rollDice());
  ut.updateStorage(game);
  console.log("round started");
  return;
}

export function continueRound(start) {
  const game = ut.loadFromStorage();
  for (let i = start || 1; i < game.numberOfPlayers; i++) {
    if (game.players[i].placeBid() === "call") {
      console.log(`player ${i + 1} calls`);
      ut.updateStorage(game);
      return 0;
    }
    console.log(`Player ${i + 1} placed bid`);
    console.log(game.players[i].bid);
  }
  console.log(game.players)
  ut.updateStorage(game);
  return 1;
  // returns 1 if game continues and 0 if dont
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
