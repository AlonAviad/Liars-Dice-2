import * as ut from "./utils.js";
import { Game } from "./classes.js";

const game = new Game();
const numberOfPlayers = JSON.parse(
  localStorage.getItem("settings")
).numberOfPlayers;
const players = game.players;

function gameInit() {
  const firstToPlay = Math.floor(Math.random() * numberOfPlayers);
  startRound(firstToPlay);
}

function startRound(firstToPlay) {
  /*
  Initialize round:
  clear table and moves
  rolls all dice
  place all bids (from starting player to user)
  */
  ut.clearTable();
  ut.clearBids();
  players.forEach((player) => player.rollDice());

  if (!firstToPlay) {
    return playerTurn();
  }

  return continueRound(firstToPlay + 1);
}

function playerTurn() {
  console.log(`player's turn`);
  return continueRound();
}

function continueRound(start) {
  for (let i = start || 2; i < numberOfPlayers; i++) {
    if (players[i].placebid() === "call") {
      showHands(i); // awayt
      EndRound(i);
      break;
    }
  }
  return playerTurn();
}

function EndRound(callingPlayer) {
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
}
