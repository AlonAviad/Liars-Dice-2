import * as ut from "./utils.js";
import * as core from "./game-core.js";
import { Game } from "./classes.js";

// ----------Buttons-----------

const numberOfDice = document.querySelector(".number");
const addButton = document.querySelector(".bar-add");
const subButton = document.querySelector(".bar-sub");

// Initalization
localStorage.clear();
ut.defaultSettings();
console.log("set");
const game = new Game();
updateLocalStorage();
// ut.clearTable();
ut.setPlayers();
ut.setDiceContainers();
playersRollPhase();
const myHand = game.players[0].hand;
window.game = game;

// Game variables
let chosenDie = null;
let phase = null;
const numberOfPlayers = JSON.parse(
  localStorage.getItem("settings")
).numberOfPlayers;

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
    ut.addSubButtons();
    document.querySelector(`.player1`).classList.remove("player-turn");
    document.getElementById("bid-buttons").innerHTML = "";
    round();
  }
}

function reveal() {
  ut.clearTable();
  document.querySelector(".number").textContent = "";
  document.getElementById("bid-buttons").innerHTML = "";
  document
    .querySelector(`.player${game.numberOfPlayers}`)
    .querySelector(
      ".bid"
    ).innerHTML = `${8} &#10005 <img src="/images/dice-${ut.convertDiceType(
    4
  )}.png" class="dice-image padding-left">`;
  showHands();
  setTimeout(() => playersRollPhase(), animationSpeed * numberOfPlayers);
}

function showHands(playerCalled) {
  let dice;
  const lastBid = [8, 4];
  // const lastBid = game.players[playerCalled - 1].bid;
  for (let i = playerCalled; i < numberOfPlayers + playerCalled; i++) {
    const fixedIndex = (i + 1) % numberOfPlayers;
    dice = "";
    gameplayers[fixedIndex].hand.forEach((d) => {
      d == lastBid[1] || d == 1
        ? (dice += `<img src="/images/dice-${ut.convertDiceType(
            d
          )}.png" class="dice-image choose-die"></img>`)
        : (dice += `<img src="/images/dice-${ut.convertDiceType(
            d
          )}.png" class="dice-image"></img>`);
    });
    setTimeout(() => {
      document
        .querySelector(`.${players[fixedIndex + 1].jsId}`)
        .querySelector(".dice-container").innerHTML = dice; // needs to be combined with same function for player1
    }, animationSpeed * (i - playerCalled));
  }
  const myHandDisplay = document.querySelector(".dice-container");
  let countHand;
}

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
  ut.clearTable();
  ut.addSubButtons();
  numberOfDice.textContent = null;
  placeHand(game.players[0].hand);
  document.getElementById("bid-buttons").innerHTML = "";
  round();
}

function placeHand(hand) {
  document.querySelector(".dice-container").innerHTML = "";
  let dice = "";
  hand.forEach((d) => {
    dice += `<img src="/images/dice-${ut.convertDiceType(
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
        .querySelector(
          ".bid"
        ).innerHTML = `${8} &#10005 <img src="/images/dice-${ut.convertDiceType(
        4
      )}.png" class="dice-image padding-left">`;
    }, animationSpeed * (i + 1));
  }
  setTimeout(() => {
    playersTurnPhase();
  }, animationSpeed * 5);
}

function showBids() {
  let delay = 0;
  game.players.forEach((player, i) => {
    if (player.bid == null) {
      return;
    }
    setTimeout(() => {
      document
        .querySelector(`.player${i + 1}`)
        .querySelector(".bid").innerHTML = "";
      document.querySelector(`.js-player${i + 1}`).classList.add("player-turn");
    }, animationSpeed * delay);
    setTimeout(() => {
      document
        .querySelector(`.js-player${i + 1}`)
        .classList.remove("player-turn");
      document
        .querySelector(`.player${i + 1}`)
        .querySelector(".bid").innerHTML = `${
        player.bid[0]
      } &#10005 <img src="/images/dice-${ut.convertDiceType(
        player.bid[1]
      )}.png" class="dice-image padding-left">`;
    }, animationSpeed * (delay + 1));
    delay++;
  });
} // fixed

function updateLocalStorage() {
  localStorage.setItem("game", JSON.stringify(game));
}

// if (!localStorage.getItem('game')) {
//     const game = new Game();
//     ut.updateStorage(game);
// }
window.game = ut.loadFromStorage();

let playerStarting = core.initGame(); // set game and choses player to start
