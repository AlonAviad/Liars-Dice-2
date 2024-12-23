import * as utils from "./utils.js";
import { Game } from "./classes.js";

// Game variables
let chosenDie = null;
let phase = null;
const numberOfPlayers = JSON.parse(localStorage.getItem('settings')).numberOfPlayers;
const moves = JSON.parse(localStorage.getItem('game')).moves;


// ----------Buttons-----------

const numberOfDice = document.querySelector(".number");
const addButton = document.querySelector(".bar-add");
const subButton = document.querySelector(".bar-sub");


function bid() {
  /*
  Works only if ligal bid was given.
  Put chosen bid on the table, 
  */
  if (numberOfDice.textContent != null && chosenDie != null) {
    phase = "Round";
    placeBid();
    numberOfDice.textContent = null;
    chosenDie = null;
    addSubButtons();
    document.querySelector(`.player1`).classList.remove("player-turn");
    document.getElementById("bid-buttons").innerHTML = "";
    round();
  }
}

function reveal() {
  utils.clearTable();
  document.querySelector(".number").textContent = "";
  document.getElementById("bid-buttons").innerHTML = "";
  document.querySelector(`.player${6}`).querySelector(".bid").innerHTML = `${
    moves[4][0]
  } &#10005 <img src="/images/dice-${utils.convertDiceType(
    moves[4][1]
  )}.png" class="dice-image padding-left">`;
  showHands();
  setTimeout(() => playersRollPhase(), animationSpeed * numberOfPlayers);
}

function showHands(playerCalled) {
  let dice;
  const lastBid = players[playerCalled - 1].bid;
  for (let i = playerCalled; i < (numberOfPlayers + playerCalled); i++) {
    const fixedIndex = (i + 1) % numberOfPlayers;
    dice = "";
    players[fixedIndex].hand.forEach((d) => {
      d == lastBid[1] || d == 1
        ? (dice += `<img src="/images/dice-${utils.convertDiceType(
            d
          )}.png" class="dice-image choose-die"></img>`)
        : (dice += `<img src="/images/dice-${utils.convertDiceType(
            d
          )}.png" class="dice-image"></img>`);
    });
    setTimeout(() => {
      document
        .querySelector(`.${players[fixedIndex + 1].jsId}`) 
        .querySelector(".dice-container").innerHTML = dice; // needs to be combined with same function for player1
    }, animationSpeed * (i - playerCalled));
  };
  const myHandDisplay = document.querySelector(".dice-container");
  let countHand;

};

function roll() {
  // Roll dice and set the hand on the table
  const rollSound = new Audio("images/rolling-dice-2-102706.mp3");
  rollSound.play();
  game.players.forEach((player) => player.rollDice());
  phase = "Round";
  chosenDie = null;
  document
    .querySelectorAll(".dice-image")
    .forEach((die) => (die.disabled = false));
  utils.clearTable();
  utils.addSubButtons();
  numberOfDice.textContent = null;
  placeHand(game.players[0].hand);
  document.getElementById("bid-buttons").innerHTML = "";
  round();
}



function placeHand(hand) {
  document.querySelector(".dice-container").innerHTML = "";
  let dice = "";
  hand.forEach((d) => {
    dice += `<img src="/images/dice-${utils.convertDiceType(
      d
    )}.png" class="dice-image"></img>`;
  });
  document.querySelector(".dice-container").innerHTML = dice;
}

// Game phases

function playersTurnPhase() {
  document.getElementById(
    "bid-buttons"
  ).innerHTML = `<button class="menu-button bid-button">Bid</button>
  <button class="menu-button bid-button reveal">Call Liar</button>`;
  document.querySelector(".bid-button").addEventListener("click", bid);
  document.querySelector(".reveal").addEventListener("click", reveal);
  // Add Bid and Reveal buttons

  document.querySelector(`.player1`).classList.add("player-turn");
  document.getElementById("player1-bid").innerHTML = ""; // Adds turn mark and clear player's bid on table

  phase = "playersTurn";
}

function playersRollPhase() {
  phase = "playersRoll";
  document.getElementById(
    "bid-buttons"
  ).innerHTML = `<button class="menu-button bid-button roll">Roll</button>`;
  document.querySelector(".roll").addEventListener("click", roll);

  subButton.disabled = true;
  addButton.disabled = true;
  document
    .querySelectorAll(".dice-image")
    .forEach((die) => (die.disabled = true));
}

const animationSpeed = 600;

function round() {
  // Full round ends with player's turn
  for (let i = 0; i < numberOfPlayers - 1; i++) {
    setTimeout(() => {
      document
        .querySelector(`.player${i + 2}`)
        .querySelector(".bid").innerHTML = "";
      document.querySelector(`.js-player${i + 2}`).classList.add("player-turn");
    }, animationSpeed * i);
    setTimeout(() => {
      document
        .querySelector(`.js-player${i + 2}`)
        .classList.remove("player-turn");
      document
        .querySelector(`.player${i + 2}`)
        .querySelector(".bid").innerHTML = `${
        moves[i][0]
      } &#10005 <img src="/images/dice-${utils.convertDiceType(
        moves[i][1]
      )}.png" class="dice-image padding-left">`;
    }, animationSpeed * (i + 1));
  }
  setTimeout(() => {
    playersTurnPhase();
  }, animationSpeed * 5);
};


function showBids() {
  let delay = 0
  game.players.forEach((player, i) => {
    if (player.bid == null) {
      return
      };
    setTimeout(() => {
      document
        .querySelector(`.player${i + 1}`)
        .querySelector(".bid").innerHTML = "";
      document.querySelector(`.js-player${i + 1}`).classList.add("player-turn");
    }, animationSpeed * (delay));
    setTimeout(() => {
      document
        .querySelector(`.js-player${i + 1}`)
        .classList.remove("player-turn");
      document
        .querySelector(`.player${i + 1}`)
        .querySelector(".bid").innerHTML = `${
        player.bid[0]
      } &#10005 <img src="/images/dice-${utils.convertDiceType(
        player.bid[1]
      )}.png" class="dice-image padding-left">`;
    }, animationSpeed * (delay + 1));
    delay++;
  });
};// fixed


function updateLocalStorage() {
  localStorage.setItem("game", JSON.stringify(game));
}

// Initalization
// utils.clearTable();
playersRollPhase();
utils.defaultSettings();
utils.setPlayers();
utils.setDiceContainers();
const game = new Game();
updateLocalStorage();
const myHand = game.players[0].hand;
updateLocalStorage();
window.game = game;
