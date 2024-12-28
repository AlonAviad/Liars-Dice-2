import * as ut from "./utils.js";
import * as ctr from "./controls.js";
import * as core from "./game-core.js";

/*
To do:
  1. Edd keydown event listener for bid, roll and call
  2. Position changes according to number of players
  3. Add winner mark
  4. Test "continue" button

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

  // game.players[1].numberOfDice = 1; // for testing
  // game.diceInGame -= 4; // for testing
  // game.players[2].numberOfDice = 1; // for testing
  // game.diceInGame -= 4; // for testing
  // game.players[3].numberOfDice = 1; // for testing
  // game.diceInGame -= 4; // for testing
  // game.players[4].numberOfDice = 1; // for testing
  // game.diceInGame -= 4; // for testing
  // game.players[5].numberOfDice = 1; // for testing
  // game.diceInGame -= 4; // for testing
  // ut.updateStorage(game); // for testing

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
  textBox(); // show number of dice in game
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
  game = ut.loadFromStorage();
  await call(callingPlayer);
  const openningPlayer = await core.endRound(callingPlayer);
  game = ut.loadFromStorage();
  if (game.numberOfPlayers == 1) {
    return endGame();
  }
  newRound(openningPlayer);
}

function endGame() {
  game = ut.loadFromStorage();
  let text = `Game Over\n${game.players[0].name} wins!`;
  textBox(text);
  localStorage.removeItem("game");
  ctr.clearControls();
  ctr.placeExitButton();
}

function setPlayers() {
  const game = ut.loadFromStorage();
  let id;
  console.log("game befor set", game);
  let items = `<img src="/images/table4.jpg" class="table">
  <a class="menu-button exit" href="home.html">x</a>
  <div class="dice-in-game">Dice in game: 20</div>`;
  for (let i = 1; i <= game.numberOfPlayers; i++) {
    id = game.players[i-1].jsId;
    console.log(`player ${i} id: ${id}`);
    items += `<div class="player-grid player${i} position-${id}">
        <div class="bid"></div>
        <div class="cup-container">
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
    document.querySelector(`.player${i}`).querySelector(".cup-container").classList.remove("player-turn");
  }
}

function setDiceCounter() {
  const game = ut.loadFromStorage();
  for (let i = 2; i <= game.numberOfPlayers; i++) {
    document
      .querySelector(`.player${i}`)
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
      document.querySelector(`.player${i + 1}`).querySelector(".cup-container").classList.add("player-turn");
      setTimeout(() => {
        document
          .querySelector(`.player${i + 1}`).querySelector(".cup-container").classList.remove("player-turn");
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
    const fixedIndex = i % game.numberOfPlayers;
    const delay = i === playerCalled ? 0 : animationSpeed;

    diceCounter = await showPlayerHand(game.players[fixedIndex], fixedIndex, lastBid, diceCounter, delay);

    if (fixedIndex === lastPlayerToBid) {
      await showTotalDiceAndLoser(playerCalled, diceCounter);
    }
  }
}

function generateDiceImages(hand, lastBid, diceCounter) {
  let updatedCounter = diceCounter;

  const diceImages = hand
    .map((d) => {
      if (d == lastBid[1] || d == 1) {
        updatedCounter++;
        return `<img src="/images/dice-${ut.convertDiceType(
          d
        )}.png" class="dice-image choose-die"></img>`;
      } else {
        return `<img src="/images/dice-${ut.convertDiceType(
          d
        )}.png" class="dice-image"></img>`;
      }
    })
    .join("");

  return { diceImages, updatedCounter };
}

async function showPlayerHand(player, index, lastBid, diceCounter, delay) {
  const diceContainer = document.querySelector(`.player${index + 1} .dice-container`);
  const { diceImages, updatedCounter } = generateDiceImages(player.hand, lastBid, diceCounter);

  await new Promise((resolve) => {
    setTimeout(() => {
      diceContainer.innerHTML = diceImages;
      textBox(updatedCounter);
      resolve();
    }, delay);
  });

  return updatedCounter;
}

async function showTotalDiceAndLoser(playerCalled, diceCounter) {
  await new Promise((resolve) => {
    setTimeout(() => {
      const game = ut.loadFromStorage();
      const loser = core.checkWinner(playerCalled)
        ? ut.previousPlayer(playerCalled)
        : playerCalled;
      const text = `Total of ${diceCounter} dice\n${game.players[loser].name} loses a die`;
      textBox(text);
      resolve();
    }, animationSpeed);
  });
}


function textBox(text) {
  if (!text) {
    //  show number of dice in game
    const game = ut.loadFromStorage();
    text = `Dice in game: ${game.diceInGame}`;
    return;
  }
  document.querySelector(
    ".dice-in-game"
  ).textContent = text;
}
