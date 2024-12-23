import {findMinBid} from "./utils";
import {placeBid} from "./utils";

const diceInGame = JSON.parse(localStorage.getItem('game')).diceInGame;
const addButton = document.querySelector(".bar-add");
const subButton = document.querySelector(".bar-sub");
let minBid;

function removeChosenDie() {
    const dice = ["one", "two", "three", "four", "five", "six"];
  
    dice.forEach((num) => {
      document.querySelector(`.${num}`).classList.remove("choose-die");
    });
  }
function chooseDice(die) {
minBid = findMinBid(convertDiceType(die));
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
    chooseDice(convertDiceType(i + 1));
  });
});

export function addSubButtons() {
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
  };
  
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
} else if (phase === "playersRoll") {
}
};

document.addEventListener("keydown", keydown);

addButton.addEventListener("click", addOne);
subButton.addEventListener("click", subOne);