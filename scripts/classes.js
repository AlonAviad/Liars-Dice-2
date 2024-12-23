import { convertDiceType } from "./utils.js";

export class Game {
  numberOfPlayers;
  diceInGame;
  players = [];
  settings = {
    onTheSpot,
    getDiceBack,
    loserStarts
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
  }

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

    console.log(this.hand);
    
  }
}

function calculateBid() {}