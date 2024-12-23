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

  constructor(name, jsId) {
    this.name = name;
    this.jsId = jsId;
  };

  rollDice() {
    let roll = [];
    for (let i = 0; i < this.numberOfDice; i++) {
      let die = Math.floor(Math.random() * 6 + 1);
      roll.push(die);
    }
    roll.sort();
    // roll.forEach((die, i) => {
    //   roll[i] = convertDiceType(die);
    // });
    this.hand = roll;
  };

  placeBid() {
    // claculates the best bid and play (or calls liar)
    const randQ = Math.floor(Math.random() * 10 + 1)
    const randD = Math.floor(Math.random() * 6 + 1)
    this.bid = [randQ, randD];
    if (this.bid[0] == 10) {return "call"};  
  };
  
  print(){
    console.log(this.name)
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
};

function calculateBid() {}