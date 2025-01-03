import * as ut from "./utils.js";
export class Game {
  numberOfPlayers;
  diceInGame;
  players = [];
  settings = {
    onTheSpot: false,
    getDiceBack: false,
    loserStarts: false
  };

  constructor() {
    const settings = JSON.parse(localStorage.getItem("settings"));
    this.settings.onTheSpot = settings.onTheSpot;
    this.settings.getDiceBack = settings.getDiceBack;
    this.settings.loserStarts = settings.loserStarts;
    this.numberOfPlayers = settings.numberOfPlayers;
    this.diceInGame = this.numberOfPlayers * 5;

    for (let i = 1; i <= this.numberOfPlayers; i++) {
      const player = new Player(`Player ${i}`, `player${i}`);
      this.players.push(player);
    }
    this.players[0].name = settings.playerName || "Player 1";
  };

  toJSON() {
    return {
      numberOfPlayers: this.numberOfPlayers,
      diceInGame: this.diceInGame,
      players: this.players.map((player) => player.toJSON()),
      settings: this.settings,
    };
  }

  static fromJSON(data) {
    const game = new Game();
    game.numberOfPlayers = data.numberOfPlayers;
    game.diceInGame = data.diceInGame;
    game.settings = data.settings;
    game.players = data.players.map((playerData) => Player.fromJSON(playerData));
    return game;
  }
};

class Player {
  jsId;
  name;
  numberOfDice = 5;
  hand;
  bid;
  risk; // Example risk value, adjust as needed

  constructor(name, jsId, risk = 0.35) {
    this.name = name;
    this.jsId = jsId;
    this.risk = risk;
  }

  async rollDice() {
    let roll = [];
    for (let i = 0; i < this.numberOfDice; i++) {
      let die = Math.floor(Math.random() * 6 + 1);
      roll.push(die);
    }
    roll.sort();
    this.hand = roll;
    console.log(`${this.name} rolled ${this.hand}`);
  }

  makeBid(lastBid) {
    const bidQuantity = lastBid ? lastBid[0] : 1;
    const bidSeries = lastBid ? lastBid[1] : 0;
    const betOdds = ut.calculateOdds(bidQuantity, bidSeries, this.hand);
    const arr = ut.bidArray(bidQuantity, bidSeries, this.hand);
    let bid;
  
    const { myBet, myBetSeries, myBetQuantity } = calculateBid(
      arr,
      bidQuantity,
      bidSeries
    );
  
    if (betOdds > this.risk + 0.25) {
      const best = bestBid(this.hand, this.risk);
      if (best.odds < betOdds) {
        bid = [best.quantity, best.series];
        this.bid = bid;
        return bid;
      }
    }
  
    bid = compareOdds(betOdds, myBet, myBetQuantity, myBetSeries, this.risk);
    this.bid = bid;
    return bid
  }

  toJSON() {
    return {
      name: this.name,
      jsId: this.jsId,
      numberOfDice: this.numberOfDice,
      hand: this.hand,
      bid: this.bid,
    };
  }

  static fromJSON(data) {
    const player = new Player(data.name, data.jsId);
    player.numberOfDice = data.numberOfDice;
    player.hand = data.hand;
    player.bid = data.bid;
    return player;
  }
}

function calculateBid(arr, betQuantity, betSeries) {
  let myBet = 0;
  let myBetSeries = 0;
  let myBetQuantity = 0;

  for (let currentQuantity = 0; currentQuantity < 2; currentQuantity++) {
    for (let currentSeries = 0; currentSeries < 6; currentSeries++) {
      if (arr[currentQuantity][currentSeries] > myBet) {
        myBet = arr[currentQuantity][currentSeries];
        myBetSeries = currentSeries === 5 ? 1 : currentSeries + 2;

        if (betSeries === 1 && myBetSeries === 1) {
          myBetQuantity = betQuantity + 1;
        } else if (betSeries === 1 && myBetSeries !== 1) {
          myBetQuantity = betQuantity * 2 + 1 + currentQuantity;
        } else if (betSeries !== 1 && myBetSeries === 1) {
          myBetQuantity = Math.floor((betQuantity + currentQuantity) / 2);
        } else {
          myBetQuantity = betQuantity + currentQuantity;
        }
      }
    }
  }

  return { myBet, myBetSeries, myBetQuantity };
}

function compareOdds(odds, bid, bidQuantity, bidSeries, risk) {
  if (bid >= risk) {
    if (odds >= risk) {
      return [bidQuantity, bidSeries];
    }
    if (Math.abs(odds - risk) <= Math.abs(bid - risk)) {
      return [bidQuantity, bidSeries];
    }
    return "call";
  }

  if (odds < risk) {
    return "call";
  }
  if (Math.abs(odds - risk) >= Math.abs(bid - risk)) {
    return "call";
  }
  return "call";
}

function bestBid(hand, risk) {
  const arr = ut.bidArray(1, 0, hand, false, true);
  let bestBetQuantity = 0;
  let bestBetSeries = 0;
  let highestOdds = 0;

  const game = ut.loadFromStorage();
  const totalDice = game.diceInGame;

  for (
    let currentQuantity = 1;
    currentQuantity <= totalDice * 2;
    currentQuantity++
  ) {
    for (let currentSeries = 0; currentSeries < 6; currentSeries++) {
      if (arr[currentQuantity - 1][currentSeries] >= risk + 0.25) {
        bestBetSeries = currentSeries === 5 ? 1 : currentSeries + 2;
        bestBetQuantity =
          currentSeries === 5
            ? Math.floor(currentQuantity / 2)
            : currentQuantity;
        highestOdds = arr[currentQuantity - 1][currentSeries];
      }
    }
  }

  return {
    quantity: bestBetQuantity,
    series: bestBetSeries,
    odds: highestOdds,
  };
}