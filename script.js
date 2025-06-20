window.onload = function () {
  const container = document.getElementById('container');
  const matchCountEl = document.getElementById('matchCount');
  const moveCountEl = document.getElementById('moveCount');
  const scorePointEl = document.getElementById('scorePoint');
  const easyBtn = document.getElementById('easyBtn');
  const hardBtn = document.getElementById('hardBtn');
  const restartBtn = document.getElementById('restartBtn');
  const winMessage = document.getElementById('winMessage');

  const allEmojis = [
    '🐶','🐱','🦊','🐻','🐼','🐨','🐯','🦁',
    '🐮','🐷','🐸','🐵','🦄','🐔','🐧','🐦',
    '🐤','🦉','🦇','🐍','🐢','🦖','🐙','🦀',
    '🐠','🐳','🦋','🌸','🌞','🍎','🍕','🎈'
  ];

  const matchSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_2a42cd7c75.mp3?filename=correct-answer-1-602.mp3");
  const failSound = new Audio("https://cdn.pixabay.com/download/audio/2022/03/15/audio_d875fb81fa.mp3?filename=wrong-answer-126515.mp3");
  const winSound = new Audio("https://cdn.pixabay.com/download/audio/2023/02/28/audio_4b9278f5aa.mp3?filename=success-1-6297.mp3");

  let firstBox, secondBox, lockBoard;
  let matchCount, moveCount, totalPairs;
  let currentSize;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function calculateScore() {
    const minMoves = totalPairs;
    const maxMoves = totalPairs * 3;
    const rawScore = ((maxMoves - moveCount) / (maxMoves - minMoves)) * 10;
    const score = Math.max(0, Math.min(10, Math.round(rawScore)));
    scorePointEl.textContent = score;
  }

  function generateGame(size = 64) {
    currentSize = size;
    const pairCount = size / 2;
    totalPairs = pairCount;
    matchCount = 0;
    moveCount = 0;

    matchCountEl.textContent = 0;
    moveCountEl.textContent = 0;
    scorePointEl.textContent = 10;
    winMessage.style.display = "none";

    const emojis = shuffle([...allEmojis]).slice(0, pairCount);
    const emojiPairs = shuffle(emojis.flatMap(e => [e, e]));

    container.innerHTML = '';
    container.className = 'container ' + (size === 16 ? 'easy' : 'hard');
    firstBox = null;
    secondBox = null;
    lockBoard = false;

    for (let i = 0; i < size; i++) {
      const box = document.createElement('div');
      box.className = 'box';
      box.dataset.emoji = emojiPairs[i];
      box.textContent = '';

      box.addEventListener('click', () => {
        if (lockBoard || box.classList.contains('revealed')) return;

        box.textContent = box.dataset.emoji;
        box.classList.add('revealed');

        if (!firstBox) {
          firstBox = box;
        } else {
          secondBox = box;
          lockBoard = true;
          moveCount++;
          moveCountEl.textContent = moveCount;
          calculateScore();

          if (firstBox.dataset.emoji === secondBox.dataset.emoji) {
            matchCount++;
            matchCountEl.textContent = matchCount;
            matchSound.play();

            firstBox = secondBox = null;
            lockBoard = false;

            if (matchCount === totalPairs) {
              winMessage.style.display = "block";
              winSound.play();
            }
          } else {
            failSound.play();
            setTimeout(() => {
              firstBox.classList.remove('revealed');
              secondBox.classList.remove('revealed');
              firstBox.textContent = '';
              secondBox.textContent = '';
              firstBox = secondBox = null;
              lockBoard = false;
            }, 800);
          }
        }
      });

      container.appendChild(box);
    }
  }

  easyBtn.addEventListener('change', () => {
    if (easyBtn.checked) generateGame(16);
  });

  hardBtn.addEventListener('change', () => {
    if (hardBtn.checked) generateGame(64);
  });

  restartBtn.addEventListener('click', () => {
    generateGame(currentSize);
  });

  generateGame(16);
};