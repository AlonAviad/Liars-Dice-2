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
  risk = 0.35; // Example risk value, adjust as needed

  constructor(name, jsId) {
    this.name = name;
    this.jsId = jsId;
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
    const lastBidQuantity = lastBid ? lastBid[0] : 1;
    const lastBidSeries = lastBid ? lastBid[1] : 0;
    const lastBidOdds = lastBid ? ut.calculateOdds(lastBidQuantity, lastBidSeries, this.hand) : 1;

    if (ut.loadFromStorage().settings.onTheSpot && Math.abs(lastBidOdds - this.risk) <= 0.1) {
      console.log("on the spot");
      return "on the spot";
    }

    let bid;
    
    if (lastBidOdds > this.risk + 0.25) {
      const best = bestBid(this.hand, this.risk, !lastBid);
      if (best.odds < lastBidOdds) {
        bid = [best.quantity, best.series];
        this.bid = bid;
        return bid;
      }
    }
    

    const arr = ut.bidArray(lastBidQuantity, lastBidSeries, this.hand, !lastBid); // lastBid is null on first bid 

    console.log(`Last bid odds: ${lastBidOdds}`);
  
    const { myBidOdds, myBidSeries, myBidQuantity } = calculateBid(
      arr,
      lastBidQuantity,
      lastBidSeries
    );
  
    bid = compareOdds(lastBidOdds, myBidOdds, myBidQuantity, myBidSeries, this.risk);
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

function calculateBidQuantity(lastBidSeries, myBidSeries, lastBidQuantity, row) {
  if (lastBidSeries === 1) {
      return myBidSeries === 1 
          ? lastBidQuantity + 1
          : lastBidQuantity * 2 + 1 + row;
  }
  return myBidSeries === 1 
      ? (lastBidQuantity + row) / 2
      : lastBidQuantity + row;
}

function findBestBidInArray(arr, lastBidQuantity, lastBidSeries) {
  let bestBid = {
      odds: 0,
      series: 0,
      quantity: 0
  };

  for (let row = 0; row < 2; row++) { // rows represent quantity
      for (let col = 0; col < 6; col++) { // columns represent series
          if (arr[row][col] <= bestBid.odds) continue;
          
          bestBid.odds = arr[row][col];
          bestBid.series = col === 5 ? 1 : col + 2;
          bestBid.quantity = calculateBidQuantity(lastBidSeries, bestBid.series, lastBidQuantity, row);
      }
  }

  return bestBid;
}

function calculateBid(arr, bidQuantity, bidSeries) {
  const bestBid = findBestBidInArray(arr, bidQuantity, bidSeries); // can be use directly?
  
  return {
      myBidOdds: bestBid.odds,
      myBidSeries: bestBid.series,
      myBidQuantity: bestBid.quantity
  };
}

function compareOdds(lastBidOdds, bidOdds, bidQuantity, bidSeries, risk) {

  // Both bids above risk
  if (bidOdds >= risk && lastBidOdds >= risk) {
      return [bidQuantity, bidSeries];
  }
  
  // Both bids under risk
  if (bidOdds < risk && lastBidOdds < risk) {
      return "call";
  }
  
  // My bid above, last bid under risk
  if (bidOdds >= risk && lastBidOdds < risk) {
      return Math.abs(lastBidOdds - risk) <= Math.abs(bidOdds - risk) 
          ? [bidQuantity, bidSeries] 
          : "call";
  }
  
  // My bid under, last bid above risk
  if (bidOdds < risk && lastBidOdds >= risk) {
      return Math.abs(lastBidOdds - risk) >= Math.abs(bidOdds - risk)
          ? [bidQuantity, bidSeries]
          : "call";
  }
}

function bestBid(hand, risk, first = false) {
  const arr = ut.bidArray(1, 0, hand, first, true);
  let bestBidQuantity = 0;
  let bestBidSeries = 0;
  let highestOdds = 0;

  const game = ut.loadFromStorage();
  const totalDice = game.diceInGame;
  const arrayLength = first ? totalDice : totalDice * 2 + 1;

  for (
    let currentQuantity = 1;
    currentQuantity <= arrayLength;
    currentQuantity++
  ) {
    for (let currentSeries = 0; currentSeries < 6; currentSeries++) {
      if (arr[currentQuantity - 1][currentSeries] >= risk + 0.25) {
        bestBidSeries = currentSeries === 5 ? 1 : currentSeries + 2;
        bestBidQuantity =
          currentSeries === 5
            ? Math.floor(currentQuantity / 2)
            : currentQuantity;
        highestOdds = arr[currentQuantity - 1][currentSeries];
      }
    }
  }

  return {
    quantity: bestBidQuantity,
    series: bestBidSeries,
    odds: highestOdds,
  };
}