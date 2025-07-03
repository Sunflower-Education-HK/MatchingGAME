const ocean = document.getElementById("ocean");
const message = document.getElementById("message");
const targetWordDisplay = document.getElementById("targetWord");
const successAudio = document.getElementById("successAudio");
const failAudio = document.getElementById("failAudio");

// 🔢 控制魚高度範圍（避免高過漁夫）
const minTop = 20;
const maxTop = 180;

// 🧠 抽出隨機字詞
function getRandomWords(pool, count) {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 🎮 初始化遊戲
function initGame() {
  const selectedWords = getRandomWords(wordPool, 5);
  const correctWord = selectedWords[Math.floor(Math.random() * selectedWords.length)];
  targetWordDisplay.textContent = correctWord;
  ocean.innerHTML = ""; // 清空上一次魚群

  selectedWords.forEach(word => {
    const fishGroup = document.createElement("div");
    fishGroup.classList.add("fish-group");

    // 🎲 隨機位置（左右 & 高度）
    const top = Math.floor(Math.random() * (maxTop - minTop)) + minTop;
    const left = Math.floor(Math.random() * (window.innerWidth - 200));

    fishGroup.style.top = top + "px";
    fishGroup.style.left = left + "px";
    fishGroup.style.position = "absolute";

    // 🐠 加入魚圖
    const fishImg = document.createElement("img");
    fishImg.src = "img/fish1.png"; // 或你可以根據word選用fish2.png
    fishImg.className = "fish-img";

    // 🏷 加入文字標籤
    const fishLabel = document.createElement("div");
    fishLabel.className = "fish";
    fishLabel.setAttribute("data-word", word);
    fishLabel.textContent = word;

    // 🧩 組合成魚群
    fishGroup.appendChild(fishImg);
    fishGroup.appendChild(fishLabel);
    ocean.appendChild(fishGroup);

    // 🔍 點擊事件
    fishLabel.addEventListener("click", () => {
      if (word === correctWord) {
        message.textContent = "釣到啦！";
        successAudio.play();

        const fishermanImg = document.querySelector(".fisherman img");
        const fisherRect = fishermanImg.getBoundingClientRect();
        const groupRect = fishGroup.getBoundingClientRect();

        const newLeft = fisherRect.left + fisherRect.width / 2 - groupRect.width / 2;
        const newTop = fisherRect.top + fisherRect.height / 2 - groupRect.height / 2;

        fishGroup.style.transition = "all 1s ease-in-out";
        fishGroup.style.left = newLeft + "px";
        fishGroup.style.top = newTop + "px";
      } else {
        message.textContent = "再試下～";
        failAudio.play();
        fishLabel.style.backgroundColor = "#f08080";

        setTimeout(() => {
          fishLabel.style.backgroundColor = "";
          message.textContent = "";
        }, 1500);
      }
    });
  });
}

// 🚀 開始遊戲
initGame();