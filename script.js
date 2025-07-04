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

// 初始化遊戲
let currentLevel = 1;
const maxLevel = 40;

function initGame() {
  const selectedWords = getRandomWords(wordPool, 4);
  const correctWord = selectedWords[Math.floor(Math.random() * selectedWords.length)];
  targetWordDisplay.textContent = correctWord;
  document.getElementById("scoreboard").textContent = `關卡：${currentLevel} / ${maxLevel}`;
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
    fishImg.src = `img/fish${index + 1}.png`; // ✅ 每條魚用不同圖
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
            message.textContent = "🎉 恭喜完成所有關卡！";
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
initGame();