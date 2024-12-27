import * as ut from "./utils.js";

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

let handleClick;
let handleKeydown;

function enableDiceSelection() {
  const game = ut.loadFromStorage();
  const lastBid = game.players[game.numberOfPlayers - 1].bid;
  const diceImages = document.querySelectorAll(".dice-image.bar");

  handleClick = (event) => {
    const dieType = event.target.dataset.die;

    chooseDice(dieType);
  };

  handleKeydown = (event) => {
    if (!(lastBid[1] == 1 && lastBid[0] >= game.diceInGame / 2) && (event.key >= "1" && event.key <= "6") ) {
      chooseDice(ut.convertDiceType(Number(event.key)));
    } else if (event.key == "1") {
      chooseDice(ut.convertDiceType(Number(event.key)));
    }
  };

  diceImages.forEach((die) => {
    if (lastBid[1] == 1 && lastBid[0] >= game.diceInGame / 2) {
      document.querySelector(".dice-image.bar.one").addEventListener("click", handleClick);
    } else {
    die.addEventListener("click", handleClick);
    }
  });
  document.addEventListener("keydown", handleKeydown);
}

function disableDiceSelection() {
  const diceImages = document.querySelectorAll(".dice-image.bar");

  diceImages.forEach((die) => {
    die.removeEventListener("click", handleClick);
  });
  document.removeEventListener("keydown", handleKeydown);
}

function removeChosenDie() {
    const dice = ["one", "two", "three", "four", "five", "six"];
  
    dice.forEach((num) => {
      document.querySelector(`.${num}`).classList.remove("choose-die");
    });
  }

function chooseDice(die) {
  console.log("Chosen die:", die);
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

  subButton.disabled = true;
  addButton.disabled = true;

}


export function placeMoveButtons() {
  enableDiceSelection();
  document.getElementById(
    "bid-buttons"
  ).innerHTML = `<button class="menu-button bid-button bid">Bid</button>
  <button class="menu-button bid-button reveal">Call Liar</button>`
  document.querySelector(`.player1`).classList.add("player-turn");
  document.querySelector(".player1").querySelector(".bid").innerHTML = ""; // Adds turn mark and clear player's bid on table
  
  const bidButton = document.querySelector(".bid-button.bid");

  bidButton.disabled = true;

  
  addSubButtons();
  // diceButtons();
}


export function clearControls() {
  console.log("clearing controls");
  chosenDie = null;
  numberOfDice.textContent = "";
  document.getElementById("bid-buttons").innerHTML = "";

  addButton.disabled = true;
  subButton.disabled = true;

disableDiceSelection();
removeChosenDie();
}

addButton.addEventListener("click", addOne);
subButton.addEventListener("click", subOne);