import * as ut from "./utils.js";
import * as ui from "./ui-controller.js";

const game = ut.loadFromStorage();
// const diceInGame = game.diceInGame;
const addButton = document.querySelector(".bar-add");
const subButton = document.querySelector(".bar-sub");
const numberOfDice = document.querySelector(".number");
let minBid;
let chosenDie;

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
};

// --------------- Set keys ------------------------
subButton.disabled = true;

function addOne() {
  numberOfDice.textContent++;
  addSubButtons();
};

function subOne() {
  numberOfDice.textContent--;
  addSubButtons();
};

// Choose dice from bar
document.querySelectorAll(".dice-image").forEach((die, i) => {
  die.addEventListener("click", () => {
    chooseDice(ut.convertDiceType(i + 1));
  });
});

function addSubButtons() { // Enable or disable add and sub bottons
    subButton.disabled = false;
    addButton.disabled = false;
    if (
      numberOfDice.textContent == 1 ||
      (numberOfDice.textContent == minBid && chosenDie != null) ||
      numberOfDice.textContent == ""
    ) {
      subButton.disabled = true;
    }
    if (numberOfDice.textContent == game.diceInGame) {
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


// export function clickRoll() {
  // const rollSound = new Audio("images/rolling-dice-2-102706.mp3");
  // rollSound.play();
  // game.players.forEach((player) => player.rollDice());
  // chosenDie = null;
  // document
  //   .querySelectorAll(".dice-image")
  //   .forEach((die) => (die.disabled = false));
  // addSubButtons();
  // numberOfDice.textContent = null;
  // ui.placeHand(game.players[0].hand);
  // document.getElementById("bid-buttons").innerHTML = "";
  // ui.startRound();
// }

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

export function clearControls() {
  chosenDie = null;
  numberOfDice.textContent = null;
  document.getElementById("bid-buttons").innerHTML = "";
}

addButton.addEventListener("click", addOne);
subButton.addEventListener("click", subOne);