import { Game } from "./classes.js";
import * as ut from "./utils.js"
import * as core from "./game-core.js"

localStorage.clear();
ut.defaultSettings();

if (!localStorage.getItem('game')) {
    const game = new Game();
    ut.updateStorage(game);
}
window.game = ut.loadFromStorage();

core.initGame();

// core.initGame()
// let move = prompt("bid [quantity, die]. to call liar: [0, 0]");

