import * as ut from "./utils.js";

let game;

export function initializeTable() {
  game = ut.loadFromStorage();
  if (!game) {
    return console.log("failed initialize");
  }

  let firstToPlay = Math.floor(Math.random() * game.numberOfPlayers);
  return firstToPlay;
}

export async function startRound() {
  ut.clearBids();
  const game = ut.loadFromStorage();

  // Wait for all players to roll
  await Promise.all(game.players.map((player) => player.rollDice()));

  ut.updateStorage(game);
}

export function continueRound(start) {
  const game = ut.loadFromStorage();
  return new Promise((resolve) => {
    for (let i = start || 1; i < game.numberOfPlayers; i++) {
      let newBid = game.players[i].makeBid(game.players[i - 1].bid);
      if (newBid === "call") {
        ut.updateStorage(game);
        resolve(i);
        break;
      }
    }
    ut.updateStorage(game);
    resolve(0);
    // returns number of player ends round and 0 if game continues
  });
}

export async function endRound(callingPlayer) {
  let game = ut.loadFromStorage();
  let winner;
  let loser;
  if (checkWinner(callingPlayer)) {
    winner = callingPlayer;
    loser = ut.previousPlayer(callingPlayer);
  } else {
    winner = ut.previousPlayer(callingPlayer);
    loser = callingPlayer;
  }

  // Handle loser losing a die
  game.players[loser].numberOfDice--;
  game.diceInGame--;
  ut.updateStorage(game);

  // If loser lost last die
  if (!game.players[loser].numberOfDice) {
    const wasLastPlayer = loser === game.numberOfPlayers - 1;
    await removePlayer(loser);

    if (wasLastPlayer) {
      return 0;
    }

    if (game.settings.loserStarts) {
      // Next player after removed player's position
      return loser % game.numberOfPlayers;
    } else {
      // Adjust winner index if it was after removed player
      return winner > loser ? winner - 1 : winner;
    }
  }

  // Normal case - loser still in game
  return game.settings.loserStarts ? loser : winner;
}

export function checkWinner(playerCalled) {
  //  returns "true" if calling player wins
  const game = ut.loadFromStorage();
  const lastPlayerToBid = ut.previousPlayer(playerCalled);
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

function removePlayer(loser) {
  return new Promise((resolve) => {
    let game = ut.loadFromStorage();
    game.players.splice(loser, 1);
    game.numberOfPlayers--;
    ut.updateStorage(game);
    resolve();
  });
}
