import * as ut from "./utils.js";
import * as ui from "./ui-controller.js";

const game = ut.loadFromStorage();
// const diceInGame = game.diceInGame;
const addButton = document.querySelector(".bar-add");
const subButton = document.querySelector(".bar-sub");
const numberOfDice = document.querySelector(".number");
let minBid;
export let chosenDie;


// --------------- Set keys ------------------------

function addOne() {
  numberOfDice.textContent++;
  addSubButtons();
};

function subOne() {
  numberOfDice.textContent--;
  addSubButtons();
};

// Choose dice from bar
function diceButtons() {
  document.querySelectorAll(".dice-image.bar").forEach((die, i) => {
    die.disabled = false;
    die.addEventListener("click", () => {
      chooseDice(ut.convertDiceType(i + 1));
    });
  });
}

function removeChosenDie() {
    const dice = ["one", "two", "three", "four", "five", "six"];
  
    dice.forEach((num) => {
      document.querySelector(`.${num}`).classList.remove("choose-die");
    });
  }

function chooseDice(die) {
minBid = ut.findMinBid(ut.convertDiceType(die));
chosenDie == null
    ? (numberOfDice.textContent = Math.max(minBid, numberOfDice.textContent))
    : (numberOfDice.textContent = minBid);
chosenDie = die;
addSubButtons();
removeChosenDie();
document.querySelector(`.${die}`).classList.add("choose-die");

const bidButton = document.querySelector(".bid-button.bid");

bidButton.disabled = false;
};

export function addSubButtons() { // Enable or disable add and sub bottons
    const game = ut.loadFromStorage();
    subButton.disabled = false;
    addButton.disabled = false;
    if (
      numberOfDice.textContent == 1 ||
      (numberOfDice.textContent == minBid && chosenDie != null) ||
      numberOfDice.textContent == ""
    ) {
      subButton.disabled = true;
    }
    if (numberOfDice.textContent == game.diceInGame || numberOfDice.textContent == "") {
      addButton.disabled = true;
    }
  }
  
export function keydown(event) {
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
  removeChosenDie()
  }
  if (Number(event.key) <= 6 && phase != "playersRoll") {
      chooseDice(utils.convertDiceType(Number(event.key)));
  }
  if (event.key === "+" && !addButton.disabled && phase != "playersRoll") {
      addOne();
  }
  if (event.key === "-" && !subButton.disabled && phase != "playersRoll") {
      subOne();
  }
}


export function waitForClick(buttons) {
  return new Promise((resolve) => {
    const handleClick = (event) => {
      // Remove listeners from all buttons
      buttons.forEach((button) => button.removeEventListener("click", handleClick));
      resolve(event.target.dataset.choice); // Resolve with the choice from the clicked button
    };

    // Add click event listeners to all buttons
    buttons.forEach((button) => button.addEventListener("click", handleClick));
  });
}

export function placeRollButton() {
  // Set roll button
  document.getElementById(
    "bid-buttons"
  ).innerHTML = `<button class="menu-button bid-button roll">Roll</button>`;
  // document.querySelector(".roll").addEventListener("click", clickRoll);

  // Set add-sub and dice buttons
  subButton.disabled = true;
  addButton.disabled = true;
  document
    .querySelectorAll(".dice-image")
    .forEach((die) => (die.disabled = true));
}


export function placeMoveButtons() {
  document.getElementById(
    "bid-buttons"
  ).innerHTML = `<button class="menu-button bid-button bid">Bid</button>
  <button class="menu-button bid-button reveal">Call Liar</button>`
  document.querySelector(`.player1`).classList.add("player-turn");
  document.getElementById("player1-bid").innerHTML = ""; // Adds turn mark and clear player's bid on table
  
  const bidButton = document.querySelector(".bid-button.bid");

  bidButton.disabled = true;

  addSubButtons();
  diceButtons();
}


export function clearControls() {
  chosenDie = null;
  numberOfDice.textContent = "";
  document.getElementById("bid-buttons").innerHTML = "";
  document.querySelectorAll(".dice-image.bar").forEach((die, i) => {
    die.disabled = true;
  });
  addButton.disabled = true;
  subButton.disabled = true;

  removeChosenDie();
}

addButton.addEventListener("click", addOne);
subButton.addEventListener("click", subOne);

