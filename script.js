const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const playerModeBtn = document.getElementById('playerMode');
const aiModeBtn = document.getElementById('aiMode');

let currentPlayer = 'X';
let gameActive = true;
let aiMode = false;

const winningCombinations = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function startGame() {
  cells.forEach(cell => {
    cell.innerText = '';
    cell.classList.remove('x', 'o');
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  currentPlayer = 'X';
  gameActive = true;
  statusText.innerText = aiMode
    ? "Player vs AI - Your turn (X)"
    : "Player X's turn";
}

function handleClick(e) {
  const cell = e.target;
  if (!gameActive || cell.innerText !== '') return;

  makeMove(cell, currentPlayer);

  if (checkGameOver()) return;

  if (aiMode && currentPlayer === 'X') {
    currentPlayer = 'O';
    statusText.innerText = "AI is thinking...";
    setTimeout(() => {
      aiMakeMove();
      if (!checkGameOver()) {
        currentPlayer = 'X';
        statusText.innerText = "Your turn (X)";
      }
    }, 400);
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.innerText = `Player ${currentPlayer}'s turn`;
  }
}

function makeMove(cell, player) {
  cell.innerText = player;
  cell.classList.add(player.toLowerCase());
  cell.removeEventListener('click', handleClick);
}

function aiMakeMove() {
  const emptyCells = [...cells].filter(cell => cell.innerText === '');
  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  if (randomCell) {
    makeMove(randomCell, 'O');
  }
}

function checkGameOver() {
  if (checkWin(currentPlayer)) {
    statusText.innerText = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return true;
  }
  if (isDraw()) {
    statusText.innerText = "It's a draw!";
    gameActive = false;
    return true;
  }
  return false;
}

function checkWin(player) {
  return winningCombinations.some(combination =>
    combination.every(index => cells[index].innerText === player)
  );
}

function isDraw() {
  return [...cells].every(cell => cell.innerText !== '');
}

restartBtn.addEventListener('click', startGame);

playerModeBtn.addEventListener('click', () => {
  aiMode = false;
  startGame();
});

aiModeBtn.addEventListener('click', () => {
  aiMode = true;
  startGame();
});

startGame();
