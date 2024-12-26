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
    // console.log(`Player ${i + 1} placed bid: ${game.players[i].bid}`);
  }
  ut.updateStorage(game);
  return 0;
  // returns number of player ends round and 0 if game continues
}

export function playerTurn(bid) {
  players[0].bid == bid;
}

export function endRound(callingPlayer) {
  const game = ut.loadFromStorage();
  let winner;
  let loser;
  if (checkWinner(callingPlayer)) {
    winner = callingPlayer;
    loser = (callingPlayer + game.numberOfPlayers - 1) % game.numberOfPlayers;
  } else {
    winner = (callingPlayer + game.numberOfPlayers - 1) % game.numberOfPlayers;
    loser = callingPlayer;
  }
  game.players[loser].numberOfDice--;
  game.diceInGame--;
  if (game.players[loser].numberOfDice == 0) {
    removePlayer(loser);
  }
  ut.updateStorage(game);
  if (game.settings.loserStarts) {
    return loser;
  }
  return winner;
}

export function checkWinner(playerCalled) {
  //  returns "true" if calling player wins
  const game = ut.loadFromStorage();
  const lastPlayerToBid = (playerCalled + game.numberOfPlayers - 1) % game.numberOfPlayers; 
  const lastBid = game.players[lastPlayerToBid].bid;

  let diceCounter = 0;
  game.players.forEach((player) => {
    player.hand.forEach((d) => {
      if (d == lastBid[1] || d == 1) {
        diceCounter++;
      }
    });
  });
  if (diceCounter < lastBid[0]) {
    return true;
  }
  return false;
}

function endGame() {}

function removePlayer(loser) {
  console.log(`player ${loser +1} removed`);
  const game = ut.loadFromStorage();
  game.players.splice(loser, 1);
  ut.updateStorage(game);
  if (game.players.length == 1) {
    endGame()
  }
}
