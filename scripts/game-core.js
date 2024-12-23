import * as ut from "./utils.js";

let game;
let numberOfPlayers;
let players;

export function initGame() {
  
  game = ut.loadFromStorage();

  if (!game) {
    return console.log("failed initialize");
  }
  
  numberOfPlayers = game.numberOfPlayers;
  players = game.players;

  let firstToPlay = Math.floor(Math.random() * numberOfPlayers);
  firstToPlay = 1
  startRound(firstToPlay);
};

function startRound(firstToPlay) {
  /*
  Initialize round:
  clear table and moves
  rolls all dice
  place all bids (from starting player to user)
  */
 ut.clearBids();
 console.log("Clear Bids")
 players.forEach((player) => player.rollDice());
 console.log("Dice roll")
 console.log(game.players)
 console.log(`Round started with player ${firstToPlay + 1}`)
 ut.updateStorage(game);

  if (!firstToPlay) {
    return playerTurn();
  }
  return continueRound(firstToPlay);
}

function continueRound(start) {
  for (let i = start || 2; i < numberOfPlayers; i++) {
    if (players[i].placeBid() === "call") {
      // showHands(i); // awayt
      // return EndRound(i);
      return console.log(`player ${i + 1} calls`)
    }
    console.log(`Player ${i + 1} placed bid`);
    console.log(game.players[i].bid);
  }
  return playerTurn();
}

function playerTurn() {
  return console.log(`player's turn`);
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
