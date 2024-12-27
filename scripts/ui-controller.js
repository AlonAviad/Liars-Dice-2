import * as ut from "./utils.js";
import * as ctr from "./controls.js";
import * as core from "./game-core.js";

/*
Bugs:
  1. After a player has been removed the index is wrong and points to the wrong player

To do:
  1. Show loser and winner
  2. Edd keydown event listener for bid, roll and call
  3. Fixed players position
  4. End game

Next:
  1. Bidding logic
  2. Design UI and graphics
*/

const numberOfDice = document.querySelector(".number");
const animationSpeed = 600;

let game;
initializeGameUI();

async function initializeGameUI() {
  game = await ut.initializeGame();
  game.players[2].numberOfDice = 1;
  ut.updateStorage(game);
  console.log(game);
  setPlayers();
  setDiceCounter();
  const firstToPlay = core.initializeTable();
  newRound(firstToPlay);
}

async function newRound(firstToPlay) {
  console.log(`new round player index ${firstToPlay} starts, roll dice`);
  await roll();
  clearTable();
  setPlayers();
  setDiceCounter();
  showDiceCounter("round"); // show number of dice in game
  await core.startRound();
  const game = ut.loadFromStorage();

  placeHand(game.players[0].hand);
  round(firstToPlay);
}

async function roll() {
  ctr.placeRollButton();
  const rollButton = document.querySelector(".roll");
  await ctr.waitForClick([rollButton]);
  const rollSound = new Audio("images/rolling-dice-2-102706.mp3");
  rollSound.play();
  ctr.clearControls();
}

async function round(firstToPlay) {
  const playercalled = await core.continueRound(firstToPlay);
  game = ut.loadFromStorage();
  await showBids(firstToPlay);
  if (!playercalled) {
    playMove();
  } else {
    console.log("end round");
    endRound(playercalled);
  }
}

async function playMove() {
  ctr.placeMoveButtons();
  const bidButton = document.querySelector(".bid-button.bid");
  const callButton = document.querySelector(".reveal");

  bidButton.dataset.choice = "bid";
  callButton.dataset.choice = "call";

  const move = await ctr.waitForClick([bidButton, callButton]);

  if (move == "bid") {
    placeBid();
    ctr.clearControls();
    round();
  } else if (move == "call") {
    game.players[0].bid = "call";
    ut.updateStorage(game);
    endRound(0);
  }
}

async function endRound(callingPlayer) {
  await call(callingPlayer);
  const openningPlayer = await core.endRound(callingPlayer);
  newRound(openningPlayer);
}

function setPlayers() {
  const game = ut.loadFromStorage();
  console.log("game befor set", game);
  // to be changed by positions
  let items = `<img src="/images/table4.jpg" class="table">
  <a class="menu-button exit" href="home.html">x</a>
  <div class="dice-in-game">Dice in game: 20</div>`;
  for (let i = 1; i <= game.numberOfPlayers; i++) {
    items += `<div class="player-grid player${i}">
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
  document.querySelector(".table-container").innerHTML = items;
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
  const game = ut.loadFromStorage();
  for (let i = 2; i <= game.numberOfPlayers; i++) {
    document
      .querySelector(`.js-player${i}`)
      .querySelector(".square-container").innerHTML =
      '<div class="square"></div>'.repeat(game.players[i - 1].numberOfDice);
  }
}

async function call(playerCalled) {
  console.log(`Player ${playerCalled} called liar!`);
  ctr.clearControls();
  const game = ut.loadFromStorage();
  const lastPlayerToBid = ut.previousPlayer(playerCalled);
  const lastBid = game.players[lastPlayerToBid].bid;
  console.log(`last player to bid: ${lastPlayerToBid}, last bid: ${lastBid}`);
  clearTable();
  clearBids();
  document
    .querySelector(`.player${playerCalled + 1}`)
    .querySelector(".bid").innerHTML = "Called Liar!";
  document
    .querySelector(`.player${lastPlayerToBid + 1}`)
    .querySelector(".bid").innerHTML = `${
    lastBid[0]
  } &#10005 <img src="/images/dice-${ut.convertDiceType(
    lastBid[1]
  )}.png" class="dice-image padding-left">`;
  await showHands(playerCalled);
  console.log("ready for next round");
}

function placeBid() {
  const chosenDie = ctr.chosenDie;
  const numberElement = document.querySelector(".number");

  if (!numberElement) {
    console.error("Element with class .number does not exist.");
    return;
  }

  const numberOfDice = numberElement.textContent;
  if (!numberOfDice) {
    console.error(".number exists but has no text content.");
    return;
  }

  game.players[0].bid = [numberOfDice, ut.convertDiceType(chosenDie)];
  ut.updateStorage(game);
  document
    .querySelector(".player1")
    .querySelector(
      ".bid"
    ).innerHTML = `${numberOfDice} &#10005 <img src="/images/dice-${chosenDie}.png" class="dice-image padding-left">`;
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

async function showBids(startingPlayer) {
  const game = ut.loadFromStorage();
  for (let i = startingPlayer || 1; i < game.numberOfPlayers; i++) {
    await new Promise((resolve) => {
      console.log(`Player ${i + 1} bid: ${game.players[i].bid}`);
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
  const lastPlayerToBid = ut.previousPlayer(playerCalled);
  const lastBid = game.players[lastPlayerToBid].bid;
  let diceCounter = 0;
  for (let i = playerCalled; i < game.numberOfPlayers + playerCalled; i++) {
    let fixedIndex = i % game.numberOfPlayers;

    await new Promise((resolve) => {
      let dice = "";
      game.players[fixedIndex].hand.forEach((d) => {
        if (d == lastBid[1] || d == 1) {
          diceCounter++;
          dice += `<img src="/images/dice-${ut.convertDiceType(
            d
          )}.png" class="dice-image choose-die"></img>`;
        } else {
          dice += `<img src="/images/dice-${ut.convertDiceType(
            d
          )}.png" class="dice-image"></img>`;
        }
      });

      const delay = i === playerCalled ? 0 : animationSpeed;
      setTimeout(() => {
        updateDiceCounter(diceCounter);
        document
          .querySelector(`.${game.players[fixedIndex].jsId}`)
          .querySelector(".dice-container").innerHTML = dice; // needs to be combined with same function for player1
        resolve();
      }, delay);
    });
  }
}

function showDiceCounter(diceCounter) {
  const game = ut.loadFromStorage();
  if (diceCounter == "round") {
    //  show number of dice in game
    const game = ut.loadFromStorage();
    document.querySelector(
      ".dice-in-game"
    ).textContent = `Dice in game: ${game.diceInGame}`;
    return;
  }
  document.querySelector(".dice-in-game").textContent = `${diceCounter}`;
}

function updateDiceCounter(diceCounter) {
  showDiceCounter(diceCounter);
}
