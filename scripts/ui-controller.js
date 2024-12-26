import * as ut from "./utils.js";
import * as ctr from "./controls.js";
import * as core from "./game-core.js";
import { Game } from "./classes.js";

const addButton = document.querySelector(".bar-add");
const subButton = document.querySelector(".bar-sub");
const numberOfDice = document.querySelector(".number");
let chosenDie;

let game;
initializeGameUI();

async function initializeGameUI() {
  game = await ut.initializeGame();
  console.log(game);
  setPlayers();
  setDiceCounter();
  document.addEventListener("keydown", ctr.keydown);
  const firstToPlay = core.initializeTable();
  newRound(firstToPlay);
}

async function roll() {
  ctr.placeRollButton();
  const rollButton = document.querySelector(".roll");
  await ctr.waitForClick([rollButton]);
  const rollSound = new Audio("images/rolling-dice-2-102706.mp3");
  rollSound.play();
  ctr.clearControls();
}

async function newRound(firstToPlay) {
  await roll();
  clearTable();
  core.startRound();
  round(firstToPlay);
}

export async function round(firstToPlay) {
  let cont = core.continueRound(firstToPlay);
  game = ut.loadFromStorage();
  console.log(game.players);
  await showBids();
  if (cont) {
    await playMove();
  } else {
    console.log("end round");
    newRound();
  }
}

async function playMove() {
  ctr.placeMoveButtons();
  const bidButton = document.querySelector(".bid-button.bid");
  const callButton = document.querySelector(".reveal");

  // Set data-choice attributes
  bidButton.dataset.choice = "bid";
  callButton.dataset.choice = "call";

  const move = await ctr.waitForClick([bidButton, callButton]);

  if (move == "bid") {
    console.log("bid");
    placeBid();
    ctr.clearControls();
    core.continueRound();
  } else if (move == "call") {
    game.players[0].bid = "call";
    ut.updateStorage(game);
    console.log("call");
    ctr.clearControls();
    newRound();
  }
}

function setPlayers() {
  // to be changed by positions
  let players = `<img src="/images/table4.jpg" class="table">
      <a class="menu-button exit" href="home.html">x</a>
      <div class="player-grid player1">
      <div class="bid" id="player1-bid"></div>
      <div>
      <img src="/images/cup.png" class="cup-image"/>
      </div>
      <div class="dice-container"></div>
    </div>`;
  for (let i = 2; i <= game.numberOfPlayers; i++) {
    players += `<div class="player-grid player${i}">
        <div class="bid"></div>
        <div class="cup-container js-player${i}">
          <div class="square-container"></div>
          <div>
          <img src="/images/cup.png" class="cup-image"/>
          </div>
        </div>
        <div class="dice-container"></div>
      </div>`;
  }
  document.querySelector(".table-container").innerHTML = players;
}

function clearTable() {
  // Needs reformat after orginazing cups
  document.querySelector(`.player1`).querySelector(".bid").innerHTML = "";
  document.querySelector(`.player1`).classList.remove("player-turn");
  for (let i = 2; i <= game.numberOfPlayers; i++) {
    document.querySelector(`.player${i}`).querySelector(".bid").innerHTML = "";
    document
      .querySelector(`.player${i}`)
      .querySelector(".dice-container").innerHTML = "";
    document.querySelector(`.js-player${i}`).classList.remove("player-turn");
  }
}

function setDiceCounter() {
  for (let i = 2; i <= game.numberOfPlayers; i++) {
    document
      .querySelector(`.js-player${i}`)
      .querySelector(".square-container").innerHTML =
      '<div class="square"></div>'.repeat(5);
  }
}

function placeBid() {
  game.players[0].bid = [numberOfDice.textContent, chosenDie];
  console.log(game.players[0].bid);
  ut.updateStorage(game);
  document.getElementById(
    "player1-bid"
  ).innerHTML = `${numberOfDice.textContent} &#10005 <img src="/images/dice-${chosenDie}.png" class="dice-image padding-left">`;
}

function clearBids() {
  game.players.forEach((player) => {
    player.bid = null;
  });
}

export function placeHand(hand) {
  document.querySelector(".dice-container").innerHTML = "";
  let dice = "";
  hand.forEach((d) => {
    dice += `<img src="/images/dice-${ut.convertDiceType(
      d
    )}.png" class="dice-image"></img>`;
  });
  document.querySelector(".dice-container").innerHTML = dice;
}

async function showBids() {
  const game = ut.loadFromStorage();
  for (let i = 1; i < game.numberOfPlayers; i++) {
    await new Promise((resolve) => {
      // set player's turn mark
      document
        .querySelector(`.player${i + 1}`)
        .querySelector(".bid").innerHTML = "";
      document.querySelector(`.js-player${i + 1}`).classList.add("player-turn");
      setTimeout(() => {
        document
          .querySelector(`.js-player${i + 1}`)
          .classList.remove("player-turn");
        // show player's bid or call
        if (game.players[i].bid == "call") {
          document
            .querySelector(`.player${i + 1}`)
            .querySelector(".bid").innerHTML = "Called Liar!";
          resolve();
        } else {
          document
            .querySelector(`.player${i + 1}`)
            .querySelector(".bid").innerHTML = `${
            game.players[i].bid[0]
          } &#10005 <img src="/images/dice-${ut.convertDiceType(
            game.players[i].bid[1]
          )}.png" class="dice-image padding-left">`;
          resolve();
        }
      }, 600); // 1-second interval
    });
    if (game.players[i].bid == "call") break;
  }
}
