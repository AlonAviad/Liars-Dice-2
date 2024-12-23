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

let playerStarting = core.initGame(); // set game and choses player to start
const game = ut.loadFromStorage();
gameloop();

function gameloop() {
    let i = 0;
    while (game.numberOfPlayers > 1 && i < 20) {
        core.startRound();
        if(!playerStarting) {
            bidPrompt()   
            playerStarting = 1;
        }
        roundloop(playerStarting);
        i++;
    }
}

function bidPrompt() {
    const bid = prompt("Place bid: [quantity, die]. To call: [0, 0]");
    game.players[0].bid = bid;
    console.log(`bid placed by player: ${bid}`)
    if (bid == [0, 0]) {
        return 0
    }
    return 1
}

function roundloop(start) {
    console.log('round started')
    while (1) {
        if (!core.continueRound(start) || !bidPrompt()) {
            break
        }
    }
}