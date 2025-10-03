const boardEl = document.getElementById('board');
const movesEl = document.getElementById('moves');
const timerEl = document.getElementById('timer');
const restartBtn = document.getElementById('restart');
const difficultySelect = document.getElementById('difficulty');
const winModal = document.getElementById('winModal');
const winStats = document.getElementById('winStats');
const playAgainBtn = document.getElementById('playAgain');
const closeModalBtn = document.getElementById('closeModal');

let icons = [ '✈️','🌴','🏔️','🏖️','🏰','🗼','🌋','🏝️','🌆','🚗','🛳️','🎡' ];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let totalPairs = 6;
let timerInterval = null;
let secondsElapsed = 0;

function startTimer(){
  clearInterval(timerInterval);
  secondsElapsed = 0;
  timerEl.textContent = formatTime(secondsElapsed);
  timerInterval = setInterval(() => {
    secondsElapsed++;
    timerEl.textContent = formatTime(secondsElapsed);
  }, 1000);
}

function stopTimer(){ clearInterval(timerInterval); }

function formatTime(s){
  const mm = String(Math.floor(s/60)).padStart(2,'0');
  const ss = String(s%60).padStart(2,'0');
  return `Tempo: ${mm}:${ss}`;
}

function shuffle(array){
  for(let i = array.length -1; i>0; i--){
    const j = Math.floor(Math.random() * (i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function buildBoard(pairs){
  boardEl.innerHTML = '';
  firstCard = null; secondCard = null; lockBoard = false;
  moves = 0; matchedPairs = 0;
  movesEl.textContent = `Movimentos: ${moves}`;
  totalPairs = pairs;

  const chosen = icons.slice(0);
  shuffle(chosen);
  const selected = chosen.slice(0, pairs);
  const cardFaces = shuffleArray([...selected, ...selected]);

  if(pairs <= 4) boardEl.className = 'board cols-2';
  else if(pairs <= 6) boardEl.className = 'board cols-3';
  else boardEl.className = 'board cols-4';

  cardFaces.forEach((face) => {
    const card = document.createElement('button');
    card.className = 'card';
    card.dataset.face = face;
    card.innerHTML = `
      <div class="inner">
        <div class="face back">?</div>
        <div class="face front"><span>${face}</span></div>
      </div>
    `;
    card.addEventListener('click', onCardClick);
    boardEl.appendChild(card);
  });

  startTimer();
}

function shuffleArray(arr){
  const copy = arr.slice();
  shuffle(copy);
  return copy;
}

function onCardClick(e){
  const card = e.currentTarget;
  if(lockBoard) return;
  if(card === firstCard) return;
  if(card.classList.contains('matched')) return;

  flip(card);

  if(!firstCard){
    firstCard = card;
    return;
  }

  secondCard = card;
  lockBoard = true;
  moves++;
  movesEl.textContent = `Movimentos: ${moves}`;
  checkForMatch();
}

function flip(card){ card.classList.add('flipped'); }
function unflip(card){ card.classList.remove('flipped'); }

function checkForMatch(){
  const isMatch = firstCard.dataset.face === secondCard.dataset.face;
  if(isMatch){
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    matchedPairs++;
    resetTurn();
    if(matchedPairs === totalPairs){ setTimeout(win, 600); }
  } else {
    setTimeout(() => {
      unflip(firstCard);
      unflip(secondCard);
      resetTurn();
    }, 800);
  }
}

function resetTurn(){
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function win(){
  stopTimer();
  winStats.textContent = `Você completou ${totalPairs} pares em ${moves} movimentos — ${formatTime(secondsElapsed).replace('Tempo: ','')}`;
  winModal.classList.remove('hidden');
}

restartBtn.addEventListener('click', () => { buildBoard(parseInt(difficultySelect.value, 10)); });
difficultySelect.addEventListener('change', () => { buildBoard(parseInt(difficultySelect.value, 10)); });
playAgainBtn.addEventListener('click', () => { winModal.classList.add('hidden'); buildBoard(parseInt(difficultySelect.value, 10)); });
closeModalBtn.addEventListener('click', () => { winModal.classList.add('hidden'); });

buildBoard(parseInt(difficultySelect.value, 10));