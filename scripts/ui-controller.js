import * as ut from "./utils.js";
import * as ctr from "./controls.js";
import * as core from "./game-core.js";

/*
Bugs to fix:
  1. Player 1 grid is not the same as other players, cousinhg problems with the bid display
  2. Cancel dice choice while not in player's turn

To do:
  1. Display dice counter
  2. End round and check winner
  3. Show loser and winner
  4. Loser loses dice
  5. Winner starts next round
*/

const numberOfDice = document.querySelector(".number");
const animationSpeed = 600;

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
  console.log("new round, roll dice");
  await roll();
  clearTable();
  await core.startRound();
  const game = ut.loadFromStorage();
  console.log(game.players[0].hand);
  placeHand(game.players[0].hand);
  round(firstToPlay);
}

export async function round(firstToPlay) {
  const playercalled = core.continueRound(firstToPlay);
  game = ut.loadFromStorage();
  console.log(game.players);
  await showBids();
  if (!playercalled) {
    playMove();
  } else {
    console.log("end round");
    console.log(playercalled);
    await call(playercalled);
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
    round();
  } else if (move == "call") {
    game.players[0].bid = "call";
    ut.updateStorage(game);
    console.log("call");
    await call(0);
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

async function call(playerCalled) {
  ctr.clearControls();
  const game = ut.loadFromStorage();
  const lastPlayerToBid = (playerCalled + game.numberOfPlayers - 1) % game.numberOfPlayers;
  const lastBid = game.players[lastPlayerToBid].bid;
  console.log(`last player to bid: ${lastPlayerToBid}, last bid: ${lastBid}`);
  clearTable();
  clearBids();
  document.querySelector(`.player${playerCalled + 1}`).querySelector(".bid").innerHTML = "Called Liar!";
  document
        .querySelector(`.player${lastPlayerToBid + 1}`)
        .querySelector(".bid").innerHTML = `${lastBid[0]} &#10005 <img src="/images/dice-${ut.convertDiceType(lastBid[1])}.png" class="dice-image padding-left">`;
  await showHands(playerCalled);
  console.log("ready for next round");
}


function placeBid() {
  const chosenDie = ctr.chosenDie;
  game.players[0].bid = [numberOfDice.textContent, chosenDie];
  ut.updateStorage(game);
  document.getElementById(
    "player1-bid"
  ).innerHTML = `${numberOfDice.textContent} &#10005 <img src="/images/dice-${chosenDie}.png" class="dice-image padding-left">`;
  document.querySelector(`.player1`).classList.remove("player-turn");
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
      }, animationSpeed); // 1-second interval
    });
    if (game.players[i].bid == "call") break;
  }
}

async function showHands(playerCalled) {
  const game = ut.loadFromStorage();
  const lastPlayerToBid = (playerCalled + game.numberOfPlayers - 1) % game.numberOfPlayers;
  const lastBid = game.players[lastPlayerToBid].bid;
  let diceCounter = 0;
  for (let i = playerCalled; i < game.numberOfPlayers + playerCalled; i++) {
    let fixedIndex = i % game.numberOfPlayers;

    await new Promise((resolve) => {
      let dice = "";
      game.players[fixedIndex].hand.forEach((d) => {
        if (d == lastBid[1] || d == 1) {
          diceCounter ++;
          (dice += `<img src="/images/dice-${ut.convertDiceType(
              d
            )}.png" class="dice-image choose-die"></img>`)
        } else {
          dice += `<img src="/images/dice-${ut.convertDiceType(
              d
            )}.png" class="dice-image"></img>`;
          }
        });
        updateDiceCounter(diceCounter);

      const delay = i === playerCalled ? 0 : animationSpeed;
      setTimeout(() => {
        document
          .querySelector(`.${game.players[fixedIndex].jsId}`)
          .querySelector(".dice-container").innerHTML = dice; // needs to be combined with same function for player1
        resolve();
      }, delay);
    });
  }
}

function showDiceCounter() {

}

function updateDiceCounter(diceCounter) {
  console.log(diceCounter);
}