const ocean = document.getElementById("ocean");
const message = document.getElementById("message");
const targetWordDisplay = document.getElementById("targetWord");
const successAudio = document.getElementById("successAudio");
const failAudio = document.getElementById("failAudio");
const replayBtn = document.getElementById("replayBtn");
const scoreboard = document.getElementById("scoreboard");

const oceanHeight = ocean.offsetHeight;
const minTop = oceanHeight * 0.1;
const maxTop = oceanHeight * 0.65;
const usedTops = [];

let availableVoices = [];
speechSynthesis.onvoiceschanged = () => {
  availableVoices = speechSynthesis.getVoices();
};

function speakWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US";
  utterance.rate = 0.8;
  utterance.pitch = 1;

  const femaleVoice = availableVoices.find(
    voice => voice.lang === "en-US" && voice.name.toLowerCase().includes("female")
  );
  if (femaleVoice) utterance.voice = femaleVoice;

  speechSynthesis.speak(utterance);
}

function getRandomWords(pool, count) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getNonOverlappingTop() {
  let top;
  let attempts = 0;
  do {
    top = Math.floor(Math.random() * (maxTop - minTop)) + minTop;
    attempts++;
  } while (usedTops.some(t => Math.abs(t - top) < 40) && attempts < 100);
  usedTops.push(top);
  return top;
}

function animateFish(fishGroup, direction = 1) {
  let posX = parseFloat(fishGroup.style.left) || 0;
  const speed = 0.5 + Math.random() * 1.5;
  const maxX = window.innerWidth - 40;

  function move() {
    posX += speed * direction;
    fishGroup.style.left = posX + "px";

    if (posX <= 0 || posX >= maxX) {
      direction *= -1;
      const fishImg = fishGroup.querySelector("img");
      if (fishImg) {
        fishImg.style.transform = direction === 1 ? "scaleX(1)" : "scaleX(-1)";
      }
    }

    fishGroup.dataset.direction = direction;
    fishGroup._animationFrame = requestAnimationFrame(move);
  }

  move();
}

let currentLevel = parseInt(localStorage.getItem('enLevelProgress')) || 1;
const maxLevel = 40;
const usedCorrectWords = [];

function initGame() {
  localStorage.setItem('enLevelProgress', currentLevel);

  const unusedWords = wordPool.filter(w => !usedCorrectWords.includes(w));
  if (unusedWords.length === 0 || currentLevel > maxLevel) {
    showFinalMessage();
    return;
  }

  const correctWord = unusedWords[Math.floor(Math.random() * unusedWords.length)];
  usedCorrectWords.push(correctWord);

  const distractors = wordPool.filter(w => w !== correctWord);
  const distractorChoices = getRandomWords(distractors, 3);
  const selectedWords = [...distractorChoices, correctWord];
  const shuffledWords = getRandomWords(selectedWords, 4);

  targetWordDisplay.textContent = "";
  targetWordDisplay.dataset.word = correctWord;
  speakWord(correctWord);

  scoreboard.textContent = `Level: ${currentLevel} / ${maxLevel}`;
  ocean.innerHTML = "";
  usedTops.length = 0;
  message.textContent = "";

  shuffledWords.forEach((word, index) => {
    const fishGroup = document.createElement("div");
    fishGroup.classList.add("fish-group");

    const top = getNonOverlappingTop();
    const left = Math.floor(Math.random() * (window.innerWidth - 40));
    fishGroup.style.top = top + "px";
    fishGroup.style.left = left + "px";
    fishGroup.style.position = "absolute";

    const fishImg = document.createElement("img");
    fishImg.src = `img/fish${index + 1}.png`;
    fishImg.className = "fish-img";

    const fishLabel = document.createElement("div");
    fishLabel.className = "fish";
    fishLabel.setAttribute("data-word", word);
    fishLabel.textContent = word;

    fishGroup.appendChild(fishImg);
    fishGroup.appendChild(fishLabel);
    ocean.appendChild(fishGroup);

    const initialDirection = Math.random() > 0.5 ? 1 : -1;
    if (initialDirection === -1) fishImg.style.transform = "scaleX(-1)";
    animateFish(fishGroup, initialDirection);

    fishLabel.addEventListener("click", () => {
      cancelAnimationFrame(fishGroup._animationFrame);
      fishGroup.style.transition = "opacity 0.8s ease-out";
      fishGroup.style.opacity = "0";

      if (word === correctWord) {
        message.textContent = "Caught it!";
        successAudio.play();

        const currentCorrect = parseInt(localStorage.getItem('enCorrectCount')) || 0;
        localStorage.setItem('enCorrectCount', currentCorrect + 1);
      } else {
        message.textContent = "Oops! Try again~";
        failAudio.play();
        fishLabel.style.backgroundColor = "#DC143C";
      }

      setTimeout(() => {
        fishGroup.remove();
        fishLabel.style.backgroundColor = "";
        message.textContent = "";
        currentLevel++;
        localStorage.setItem('enLevelProgress', currentLevel);
        initGame();
      }, 800);
    });
  });
}

function showFinalMessage() {
  message.innerHTML = "";
  const messageBox = document.createElement("div");
  messageBox.style.display = "flex";
  messageBox.style.flexDirection = "column";
  messageBox.style.alignItems = "center";

  const congratsText = document.createElement("div");
  congratsText.textContent = "🎉 Congratulations on completing all levels!";
  congratsText.style.fontSize = "28px";
  congratsText.style.marginBottom = "20px";
  congratsText.style.textAlign = "center";

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next Level";
  nextBtn.style.padding = "10px 20px";
  nextBtn.style.fontSize = "18px";
  nextBtn.style.borderRadius = "10px";
  nextBtn.style.cursor = "pointer";
  nextBtn.style.backgroundColor = "#4CAF50";
  nextBtn.style.color = "white";
  nextBtn.style.border = "none";
  nextBtn.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.2)";
  nextBtn.style.transition = "transform 0.2s";

  nextBtn.addEventListener("mouseover", () => {
    nextBtn.style.transform = "scale(1.05)";
  });
  nextBtn.addEventListener("mouseout", () => {
    nextBtn.style.transform = "scale(1)";
  });

  nextBtn.addEventListener("click", () => {
    window.location.href = "engLevel2.html";
  });

  messageBox.appendChild(congratsText);
  messageBox.appendChild(nextBtn);
  message.appendChild(messageBox);
}

replayBtn.addEventListener("click", () => {
  const word = targetWordDisplay.dataset.word;
  if (word) speakWord(word);
});

initGame();