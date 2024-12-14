// Initiate New Game and Continue buttons
if (!('game' in localStorage)) {
  document.querySelector('.js-continue').remove();
}

function openGame() {
  if (!('game' in localStorage)) {
    window.location.href = 'game.html';
    localStorage.setItem('game', null);
  }
  else {
    alert('Game will be lost');
  }
}

// Exit
function exit() {
    localStorage.removeItem('settings');
    localStorage.removeItem('game');
    document.querySelector('.js-continue').remove();

}