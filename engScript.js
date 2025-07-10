const ocean = document.getElementById("ocean");
const message = document.getElementById("message");
const targetWordDisplay = document.getElementById("targetWord");
const successAudio = document.getElementById("successAudio");
const failAudio = document.getElementById("failAudio");

const oceanHeight = ocean.offsetHeight;
const minTop = oceanHeight * 0.1;
const maxTop = oceanHeight * 0.65;
const usedTops = [90];

// 隨機抽字詞
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

function speakWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-US"; // 
  utterance.rate = 0.8;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}

// 初始化遊戲
let currentLevel = 1;
const maxLevel = 2;

function initGame() {
  const selectedWords = getRandomWords(wordPool, 4);
  const correctWord = selectedWords[Math.floor(Math.random() * selectedWords.length)];

  targetWordDisplay.textContent = ""; // 不顯示文字
  targetWordDisplay.dataset.word = correctWord; // 儲存正確單字
  speakWord(correctWord); // 播放語音

  document.getElementById("scoreboard").textContent = `Levels：${currentLevel} / ${maxLevel}`;
  ocean.innerHTML = "";
  usedTops.length = 0;

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
        message.textContent = "Caught it!";
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
            message.innerHTML = "";

            const messageBox = document.createElement("div");
            messageBox.style.display = "flex";
            messageBox.style.flexDirection = "column";
            messageBox.style.alignItems = "center";

            const congratsText = document.createElement("div");
            congratsText.textContent = "🎉 Congratulations!";
            congratsText.style.fontSize = "28px";
            congratsText.style.marginBottom = "20px";
            congratsText.style.textAlign = "center";

            const nextLevelBtn = document.createElement("button");
            nextLevelBtn.textContent = "Go to Level 2";
            nextLevelBtn.style.padding = "10px 20px";
            nextLevelBtn.style.fontSize = "18px";
            nextLevelBtn.style.borderRadius = "10px";
            nextLevelBtn.style.cursor = "pointer";
            nextLevelBtn.style.backgroundColor = "#4CAF50";
            nextLevelBtn.style.color = "white";
            nextLevelBtn.style.border = "none";
            nextLevelBtn.style.boxShadow = "2px 2px 5px rgba(0,0,0,0.2)";
            nextLevelBtn.style.transition = "transform 0.2s";

            nextLevelBtn.addEventListener("mouseover", () => {
              nextLevelBtn.style.transform = "scale(1.05)";
            });
            nextLevelBtn.addEventListener("mouseout", () => {
              nextLevelBtn.style.transform = "scale(1)";
            });

            nextLevelBtn.addEventListener("click", () => {
              window.location.href = "chaLevel2.html";
            });

            // 加入畫面
            messageBox.appendChild(congratsText);
            messageBox.appendChild(nextLevelBtn);
            message.appendChild(messageBox);


            nextLevelBtn.addEventListener("click", () => {
              window.location.href = "a.html";
            });


          }
        }, 800);
      } else {
        message.textContent = "Try again~";
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

// 「再聽一次」按鈕功能
document.getElementById("replayBtn").addEventListener("click", () => {
  const word = targetWordDisplay.dataset.word;
  if (word) {
    speakWord(word);
  }
});

// 啟動遊戲
initGame();
