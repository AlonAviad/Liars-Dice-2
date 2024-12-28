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
  return new Promise((resolve) => {
    for (let i = start || 1; i < game.numberOfPlayers; i++) {
      if (game.players[i].placeBid() === "call") {
        console.log(`player ${i + 1} calls`);
        ut.updateStorage(game);
        resolve(i);
      }
      // console.log(`Player ${i + 1} placed bid: ${game.players[i].bid}`);
    }
    ut.updateStorage(game);
    resolve(0);
    // returns number of player ends round and 0 if game continues
  });
}

export function playerTurn(bid) {
  players[0].bid == bid;
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
    console.log(`player ${winner + 1} wins`);
    console.log(`player ${loser + 1} loses`);
    game.players[loser].numberOfDice--;
    console.log(`player ${loser + 1} lost a die`);
    game.diceInGame--;
    if (!game.players[loser].numberOfDice) {
      await removePlayer(loser);
      if (!game.loserStarts || loser !== callingPlayer) {
        return ut.previousPlayer(callingPlayer);
      }
      return callingPlayer;
    } else {
      ut.updateStorage(game);
    }
    if (game.settings.loserStarts) {
      return loser;
    }
    return winner;
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
    console.log(`player ${loser +1} removed`);
    game.players.splice(loser, 1);
    game.numberOfPlayers--;
    ut.updateStorage(game);
    // if (game.numberOfPlayers == 1) {
    //   endGame()
    // }
    resolve();
  });
}