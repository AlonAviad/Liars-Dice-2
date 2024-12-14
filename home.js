// Initiate New Game and Continue buttons
if (!('game' in localStorage)) {
  document.querySelector('.js-continue').remove();
}

function openGame() {
  if (!('game' in localStorage) || confirm('Old game will be lost. Do you want to continue?')) {
    window.location.href = 'game.html';
    localStorage.setItem('game', null);
  }
}

// Exit
function exit() {
    localStorage.removeItem('settings');
    localStorage.removeItem('game');
    document.querySelector('.js-continue').remove();

}