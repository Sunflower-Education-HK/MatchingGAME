const ocean = document.getElementById("ocean");
const message = document.getElementById("message");
const targetWordDisplay = document.getElementById("targetWord");
const successAudio = document.getElementById("successAudio");
const failAudio = document.getElementById("failAudio");
const replayBtn = document.getElementById("replayBtn");

const oceanHeight = ocean.offsetHeight;
const minTop = oceanHeight * 0.1;
const maxTop = oceanHeight * 0.65;
const usedTops = [90];

function getRandomWords(pool, count) {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 避免魚重疊
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

// 魚來回游動動畫
function animateFish(fishGroup, direction = 1) {
  let posX = parseFloat(fishGroup.style.left) || 0;
  const speed = 0.5 + Math.random() * 1.5;
  const maxX = window.innerWidth - 200;

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
let availableVoices = [];

speechSynthesis.onvoiceschanged = () => {
  availableVoices = speechSynthesis.getVoices();
};

function speakWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "zh-HK";
  utterance.rate = 0.9;
  utterance.pitch = 1;

  const voices = speechSynthesis.getVoices();
  const femaleVoice = voices.find(voice =>
    voice.lang === "zh-HK" && voice.name.toLowerCase().includes("female")
  );

  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  speechSynthesis.speak(utterance);
}


// 初始化遊戲
let currentLevel = 1;
const maxLevel = 1;

function initGame() {
  const selectedWords = getRandomWords(wordPool, 4);
  const correctWord = selectedWords[Math.floor(Math.random() * selectedWords.length)];

  targetWordDisplay.textContent = ""; // 不顯示文字
  targetWordDisplay.dataset.word = correctWord;
  speakWord(correctWord);

  document.getElementById("scoreboard").textContent = `關卡：${currentLevel} / ${maxLevel}`;
  ocean.innerHTML = "";
  usedTops.length = 0;
  message.textContent = "";

  selectedWords.forEach((word, index) => {
    const fishGroup = document.createElement("div");
    fishGroup.classList.add("fish-group");

    const top = getNonOverlappingTop();
    const left = Math.floor(Math.random() * (window.innerWidth - 200));
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
    if (initialDirection === -1) {
      fishImg.style.transform = "scaleX(-1)";
    }
    animateFish(fishGroup, initialDirection);

    fishLabel.addEventListener("click", () => {
      if (word === correctWord) {
        message.textContent = "釣到啦！";
        successAudio.play();

        cancelAnimationFrame(fishGroup._animationFrame);
        fishGroup.style.transition = "opacity 0.8s ease-out";
        fishGroup.style.opacity = "0";

        setTimeout(() => {
          fishGroup.remove();
          message.textContent = "";

          if (currentLevel < maxLevel) {
            currentLevel++;
            initGame();
          } else {
            showFinalMessage();
          }
        }, 800);
      } else {
        message.textContent = "再試下～";
        failAudio.play();
        fishLabel.style.backgroundColor = "#DC143C";
        setTimeout(() => {
          fishLabel.style.backgroundColor = "";
          message.textContent = "";
        }, 1500);
      }
    });
  });
}

// 顯示完成畫面與跳轉按鈕
function showFinalMessage() {
  message.innerHTML = "";

  const messageBox = document.createElement("div");
  messageBox.style.display = "flex";
  messageBox.style.flexDirection = "column";
  messageBox.style.alignItems = "center";

  const congratsText = document.createElement("div");
  congratsText.textContent = "🎉 恭喜完成所有關卡！";
  congratsText.style.fontSize = "28px";
  congratsText.style.marginBottom = "20px";
  congratsText.style.textAlign = "center";

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "下一級";
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
    window.location.href = "chaLevel2.html";
  });

  messageBox.appendChild(congratsText);
  messageBox.appendChild(nextBtn);
  message.appendChild(messageBox);
}

// 「再聽一次」按鈕功能
replayBtn.addEventListener("click", () => {
  const word = targetWordDisplay.dataset.word;
  if (word) {
    speakWord(word);
  }
});

// 啟動遊戲
initGame();
