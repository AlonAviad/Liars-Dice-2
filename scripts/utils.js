import { Game } from "./classes.js";
const game = loadFromStorage();

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

export function diceCounter () {

}


export function findMinBid(die) {
  const game = loadFromStorage();
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


export function loadFromStorage() {
  if (!localStorage.getItem('game')) {
    return;
  };
  const savedGame = JSON.parse(localStorage.getItem("game"));
  return Game.fromJSON(savedGame);
}

export function updateStorage(game) {
  localStorage.setItem("game", JSON.stringify(game.toJSON()));
};

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
export function clearBids() {
  const game = loadFromStorage();
  console.log("clear bids")
  game.players.forEach(player => {
    player.bid = null;
  });
  updateStorage(game);
}

//--------------------------------------------------