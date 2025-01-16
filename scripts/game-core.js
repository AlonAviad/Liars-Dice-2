import * as ut from "./utils.js";

let game;

export function initializeTable() {
  game = ut.loadFromStorage();
  if (!game) {
    return console.log("failed initialize");
  }

  let firstToPlay = Math.floor(Math.random() * game.numberOfPlayers);
  return firstToPlay;
};

// export function startRound() {
//   return new Promise((resolve) => {
//   ut.clearBids();
//   const game = ut.loadFromStorage();
//   game.players.forEach((player) => player.rollDice());
//   ut.updateStorage(game);
//   console.log("round started");
//   console.log(game.players);
//   resolve();}
//   );
// }

export async function startRound() {
  ut.clearBids();
  const game = ut.loadFromStorage();
  
  // Wait for all players to roll
  await Promise.all(game.players.map(player => player.rollDice()));
  
  ut.updateStorage(game);
  console.log("round started");
  console.log(game.players);
}

export function continueRound(start) { 
  const game = ut.loadFromStorage();
  console.log(`Player 1 hand: ${game.players[0].hand}`);
  return new Promise((resolve) => {
    for (let i = start || 1; i < game.numberOfPlayers; i++) {
      let newBid = game.players[i].makeBid(game.players[i-1].bid);
      console.log(`player ${i + 1} placed bid: ${newBid}`);
      console.log(`Player hand: ${game.players[i].hand}`);
      if (newBid === "call") {
        console.log(`player ${i + 1} calls`);
        ut.updateStorage(game);
        resolve(i);
        break;
      }
      // console.log(`Player ${i + 1} placed bid: ${game.players[i].bid}`);
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