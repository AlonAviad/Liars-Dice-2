import {playersHand} from "./players.js";

// Game variables
let diceInGame = 20;
let chosenDie = null;
let numOfPlayers = 6;
let minBid = 0;
let phase = null;
let myHand = [];
let moves = [
  [6, "three"],
  [6, "six"],
  [7, "five"],
  [4, "one"],
  [9, "three"],
];

// ----------Buttons-----------

const numberOfDice = document.querySelector(".number");
const addButton = document.querySelector(".bar-add");
const subButton = document.querySelector(".bar-sub");

subButton.disabled = true;

function addOne() {
  numberOfDice.textContent++;
  addSubButtons();
}

function subOne() {
  numberOfDice.textContent--;
  addSubButtons();
}

function bid() {
  /*
  Works only if ligal bid was given.
  Put chosen bid on the table, 
  */
  if (numberOfDice.textContent != null && chosenDie != null) {
    phase = "Round";
    placeBid();
    removeChosenDie();
    numberOfDice.textContent = null;
    chosenDie = null;
    addSubButtons();
    document.querySelector(`.player1`).classList.remove("player-turn");
    document.getElementById("bid-buttons").innerHTML = "";
    round();
  }
}

function reveal() {
  clearTable();
  document.querySelector(".number").textContent = "";
  document.getElementById("bid-buttons").innerHTML = "";
  removeChosenDie();
  document.querySelector(`.player${6}`)
    .querySelector(
      ".bid"
    ).innerHTML = `${moves[4][0]} &#10005 <img src="/images/dice-${moves[4][1]}.png" class="dice-image padding-left">`;
    showHands();
  playersRollPhase();
}

function showHands() {
  const myHandDisplay = document.querySelector(".dice-container");
  let countHand;
  myHand.forEach((d) => {
    d == moves[4][1] || d == 'one' ? countHand += `<img src="/images/dice-${d}.png" class="dice-image choose-die"></img>` : countHand += `<img src="/images/dice-${d}.png" class="dice-image"></img>`;
  })
  myHandDisplay.innerHTML = countHand;

  playersHand.forEach((hand, i) => {
    let dice = "";
    hand.forEach((d) => {
      d == moves[4][1] || d == 'one' ? dice += `<img src="/images/dice-${d}.png" class="dice-image choose-die"></img>` : dice += `<img src="/images/dice-${d}.png" class="dice-image"></img>`;
    });
    // console.log(dice)
      setTimeout(() => {
      document
      .querySelector(`.player${i + 2}`)
      .querySelector(
        ".dice-container"
      ).innerHTML = dice; // needs to br combined with same function for player1
  }, animationSpeed * (i + 1))
  });
}

function roll() { // Roll dice and set the hand on the table
  phase = "Round";
  chosenDie = null;
  document.querySelectorAll(".dice-image").forEach((die) => die.disabled = false);
  clearTable();
  removeChosenDie();
  addSubButtons();
  numberOfDice.textContent = null;
  myHand = rollDice(5);
  placeHand(myHand);
  document.getElementById("bid-buttons").innerHTML = "";
  round();
}
export function rollDice(numberOfDice) {
  let roll = [];
  for (let i = 0; i < numberOfDice; i++) {
    let die = Math.floor(Math.random() * 6 + 1);
    roll.push(die);
  }
  roll.sort();
  roll.forEach((die, i) => {
    roll[i] = convertDiceType(die);
  });
  return roll;
}
function chooseDice(die) {
  minBid = findMinBid(die);
  chosenDie == null
    ? (numberOfDice.textContent = Math.max(minBid, numberOfDice.textContent))
    : (numberOfDice.textContent = minBid);
  chosenDie = die;
  addSubButtons();
  removeChosenDie();
  document.querySelector(`.${die}`).classList.add("choose-die");
}

function removeChosenDie() {
  const dice = ["one", "two", "three", "four", "five", "six"];

  dice.forEach((num) => {
    document.querySelector(`.${num}`).classList.remove("choose-die");
  });
}

function addSubButtons() {
  subButton.disabled = false;
  addButton.disabled = false;
  if (
    numberOfDice.textContent == 1 ||
    (numberOfDice.textContent == minBid && chosenDie != null) ||
    numberOfDice.textContent == ""
  ) {
    subButton.disabled = true;
  }
  if (numberOfDice.textContent == diceInGame) {
    addButton.disabled = true;
  }
}

// Choose dice from bar
document.querySelectorAll(".dice-image").forEach((die, i) => {
    die.addEventListener("click", () => {
      chooseDice(convertDiceType(i + 1));
    });
  });

// Set keys
function keydown(event) {
    if (event.key == "Enter") {
      if (phase == "playersRoll") {
        roll();
      } else if (phase == "playersTurn") {
        if (event.shiftKey) {
          reveal();
        } else {
          bid();
        }
      }
    }
    if (Number(event.key) <= 6 && phase != "playersRoll") {
      chooseDice(convertDiceType(Number(event.key)));
    }
    if (
      event.key === "+" &&
      !addButton.disabled &&
      phase != "playersRoll"
    ) {
      addOne();
    }
    if (
      event.key === "-" &&
      !subButton.disabled &&
      phase != "playersRoll"
    ) {
      subOne();
    } else if (phase === "playersRoll") {
    }
  }
document.addEventListener("keydown", keydown);
  
addButton.addEventListener("click", addOne);
subButton.addEventListener("click", subOne);


//--------------------------------------------------

function convertDiceType(die) {
  const dice = ["one", "two", "three", "four", "five", "six"];
  if (typeof die == "string") {
    return dice.indexOf(die) + 1
  } else if (typeof die == "number") {
    return dice[die - 1];
  }
}

function findMinBid(stringDie) {
  const die = convertDiceType(stringDie);
  const lastD = convertDiceType(moves[numOfPlayers - 2][1]);
  const lastQ = moves[numOfPlayers - 2][0];
  if (lastD == 1) {
    if (die == 1) {
      return lastQ + 1;
    } else {
      return 2 * lastQ + 1;
    }
  } else {
    if (die == 1) {
      return Math.ceil(lastQ / 2);
    } else if (die <= lastD) {
      return lastQ + 1;
    } else {
      return lastQ;
    }
  }
}

function clearTable() {
  // Needs reformat after orginazing cups
  document.querySelector(`.player1`).querySelector(".bid").innerHTML = "";
  document.querySelector(`.player1`).classList.remove("player-turn");
  for (let i = 2; i < numOfPlayers + 1; i++) {
    document.querySelector(`.player${i}`).querySelector(".bid").innerHTML = "";
    document.querySelector(`.player${i}`).querySelector(".dice-container").innerHTML = "";
    document.querySelector(`.js-player${i}`).classList.remove("player-turn");
  }
}



function placeHand(hand) {
  document.querySelector(".dice-container").innerHTML = "";
  let dice = "";
  hand.forEach((d) => {
    dice += `<img src="/images/dice-${d}.png" class="dice-image"></img>`;
  });
  document.querySelector(".dice-container").innerHTML = dice;
}

function placeBid() {
  document.getElementById(
    "player1-bid"
  ).innerHTML = `${numberOfDice.textContent} &#10005 <img src="/images/dice-${chosenDie}.png" class="dice-image padding-left">`;
}

// Game phases

function playersTurnPhase() {
  document.getElementById(
    "bid-buttons"
  ).innerHTML = `<button class="menu-button bid-button bid">Bid</button>
  <button class="menu-button bid-button reveal">Call Liar</button>`; 
  document.querySelector('.bid').addEventListener("click", bid);
  document.querySelector('.reveal').addEventListener("click", reveal);
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
  document.querySelector('.roll').addEventListener("click", roll);

  subButton.disabled = true;
  addButton.disabled = true;
  document.querySelectorAll(".dice-image").forEach((die) => die.disabled = true);
}


const animationSpeed = 600;

function round() {
  // Full round ends with player's turn
  for (let i = 0; i < numOfPlayers - 1; i++) {
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
        ).innerHTML = `${moves[i][0]} &#10005 <img src="/images/dice-${moves[i][1]}.png" class="dice-image padding-left">`;
    }, animationSpeed * (i + 1));
  }
  setTimeout(() => {
    playersTurnPhase();
  }, animationSpeed * 5);
}

// Initalization
clearTable();
playersRollPhase();

console.log(playersHand);
