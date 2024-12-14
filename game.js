// Game variables
let diceInGame = 20;
let minBet = 5;
let chosenDie = null;
let playersTurn = false;
let playerRoll = true;
let numOfPlayers = 6

// Game bar buttons
const numberOfDice = document.querySelector(".number");

document.querySelector(".bar-sub").disabled = true;

function addOne() {
  numberOfDice.textContent++;
  addSubButtons();
}

function subOne() {
  numberOfDice.textContent--;
  addSubButtons();
}

function bet() {
  /*
  Works only if ligal bet was given.
  Put chosen bet on the table, 
  */
  if (playersTurn == true && (numberOfDice.textContent != null && chosenDie != null)) {
    placeBet();
    removeChosenDie();
    numberOfDice.textContent = null;
    chosenDie = null;
    playersTurn = true; 
    addSubButtons();
    betButtons()
    document.querySelector(`.player1`).classList.remove("player-turn")
    round()
  }
}

reveal = () => {
  playersTurn = false;
  betButtons();
  clearTable();
  document.querySelector(`.player${6}`).querySelector(".bet").innerHTML = `${moves[4][0]} &#10005 <img src="/images/dice-${moves[4][1]}.png" class="dice-image padding-left">`;
  playerRoll = true
}

function roll() { // Roll dice and set the hand on the table
  playerRoll = false;
  clearTable();
  removeChosenDie();
  numberOfDice.textContent = null;
  addSubButtons();
  let hand = rollDice(5);
  placeHand(hand);
  document.getElementById("bet-buttons").innerHTML="";  
  round()
}

function chooseDice(die) {
  minBet = findMinBet(die)
  chosenDie == null ? numberOfDice.textContent = Math.max(minBet, numberOfDice.textContent) : numberOfDice.textContent = minBet;
  chosenDie = die;
  addSubButtons();
  removeChosenDie();
  document.querySelector(`.${die}`).classList.add("choose-die");
}

function placeBet() {
  document.getElementById(
    "player1-bet"
  ).innerHTML = `${numberOfDice.textContent} &#10005 <img src="/images/dice-${chosenDie}.png" class="dice-image padding-left">`;
}

function removeChosenDie() {
  let dice = ["one", "two", "three", "four", "five", "six"];
  
  dice.forEach((num) => {
    document.querySelector(`.${num}`).classList.remove("choose-die");
  });
}

function betButtons() {
  if (playersTurn == true) {
  document.getElementById("bet-buttons").innerHTML = `<button class="menu-button bet-button" onclick=bet()>Bet</button>
  <button class="menu-button bet-button" onclick=reveal()>Reveal</button>`
  } else {
    document.getElementById("bet-buttons").innerHTML="";
  }
}


function addSubButtons(){
  document.querySelector(".bar-sub").disabled = false;
  document.querySelector(".bar-add").disabled = false;
  if (numberOfDice.textContent == 1 || (numberOfDice.textContent == minBet && chosenDie != null) || numberOfDice.textContent == '') {
    document.querySelector(".bar-sub").disabled = true;
  }
  if (numberOfDice.textContent == diceInGame) {
    document.querySelector(".bar-add").disabled = true;
  }
}

let moves = [[6, 'three'], [6, 'six'], [7, "five"], [4, "one"], [9, "three"]]

const animationSpeed = 2000;
function round(){ // Full round ends with player's turn
for (let i=0; i<numOfPlayers-1; i++) {
  setTimeout(() => {
    document.querySelector(`.player${i+2}`).querySelector(".bet").innerHTML = "";
    document.querySelector(`.js-player${i+2}`).classList.add("player-turn")},
    animationSpeed*i);
  setTimeout(function() {
    document.querySelector(`.js-player${i+2}`).classList.remove("player-turn");
    document.querySelector(`.player${i+2}`).querySelector(".bet").innerHTML = `${moves[i][0]} &#10005 <img src="/images/dice-${moves[i][1]}.png" class="dice-image padding-left">`;
  } ,animationSpeed*(i+1))
  }
  setTimeout(() => {
    playersTurn = true;
    document.querySelector(`.player1`).classList.add("player-turn");
    betButtons();
    document.getElementById(
      "player1-bet"
    ).innerHTML=""},
    animationSpeed*5);
}


clearTable() // Starts round when page up

function convertDiceType(die) {
  if (typeof(die) == "string"){
    if (die == 'one'){
      return 1;
    }
    if (die == 'two'){
      return 2;
    }
    if (die == 'three'){
      return 3;
    }
    if (die == 'four'){
      return 4;
    }
    if (die == 'five'){
      return 5;
    }
    if (die == 'six'){
      return 6;
    }
  } else if (typeof(die) == "number") {
    if (die == 1){
      return 'one';
    }
    if (die == 2){
      return 'two';
    }
    if (die == 3){
      return 'three';
    }
    if (die == 4){
      return 'four';
    }
    if (die == 5){
      return 'five';
    }
    if (die == 6){
      return 'six';
    }
  }
}

function findMinBet (stringDie) {
  const die = convertDiceType(stringDie)
  const lastD = convertDiceType(moves[numOfPlayers-2][1])
  const lastQ = moves[numOfPlayers-2][0]
  if (lastD == 1) {
    if (die == 1) {
      return lastQ + 1;
    } else {
      return 2 * lastQ + 1;
    }
  } else {
    if (die == 1) {
      return Math.ceil(lastQ/2);
    } else if (die <= lastD) {
      return lastQ + 1;
    } else {
      return lastQ;
    }
  }
}

function clearTable() { // Need reformat after orginazing cups
  document.querySelector(`.player1`).querySelector(".bet").innerHTML = "";
  document.querySelector(`.player1`).classList.remove("player-turn")
  for (let i = 2; i<numOfPlayers + 1; i++) {
    document.querySelector(`.player${i}`).querySelector(".bet").innerHTML = "";
    document.querySelector(`.js-player${i}`).classList.remove("player-turn");
  }
  document.getElementById("bet-buttons").innerHTML = `<button class="menu-button bet-button" onclick=roll()>Roll</button>`
}

function rollDice(numberOfDice) {
  let roll = []
  for (let i = 0; i < numberOfDice; i++) {
    let die = Math.floor(Math.random() * 6 + 1);
    roll.push(die);
  }
  roll.sort();
  roll.forEach((die, i) => {
    roll[i] = convertDiceType(die)
  });
  return roll;
}

function placeHand(hand){
  document.querySelector(".dice-container").innerHTML = '';
  let dice = ''
  hand.forEach(d => {
 dice += `<img src="/images/dice-${d}.png" class="dice-image"></img>`
  });
  document.querySelector(".dice-container").innerHTML = dice;
}

// Choose dice from bar
document.querySelector(".one").addEventListener('click', () => {chooseDice('one')});
document.querySelector(".two").addEventListener('click', () => {chooseDice('two')});
document.querySelector(".three").addEventListener('click', () => {chooseDice('three')});
document.querySelector(".four").addEventListener('click', () => {chooseDice('four')});
document.querySelector(".five").addEventListener('click', () => {chooseDice('five')});
document.querySelector(".six").addEventListener('click', () => {chooseDice('six')});

// Set keys
document.addEventListener('keydown', (event) => { 
  if (Number(event.key) <= 6) {
    chooseDice(convertDiceType(Number(event.key)));
  }
  if (event.key == '+' && document.querySelector(".bar-add").disabled == false) {
    addOne();
  }
  if (event.key == '-' && document.querySelector(".bar-sub").disabled == false) {
    subOne();
  }
  if (event.key == 'Enter') {
    if (playerRoll == true && !event.shiftKey) {
      roll();
    } else if (event.shiftKey && playersTurn == true) {
      reveal();
    } else if (playersTurn == true) {
      bet();
    }
  }
});


