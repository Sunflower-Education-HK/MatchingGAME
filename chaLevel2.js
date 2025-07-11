const part1 = document.getElementById("part1");
const part2 = document.getElementById("part2");
const part3 = document.getElementById("part3");
const train = document.getElementById("train");
const replayBtn = document.getElementById("replayBtn");
const trainSound = document.getElementById("trainSound");
const failSound = document.getElementById("failSound");
const message = document.getElementById("message");
const progressTracker = document.getElementById("progressTracker");
const wordOptions = document.querySelectorAll(".word-option");
const car2Img = document.getElementById("car2Img");

let currentIndex = 0;
let correctCount = 0;
const totalQuestions = level2Sentences.length;
const passThreshold = Math.ceil(totalQuestions * 0.8); // 通關門檻：80%

function initGame() {
  const sentence = level2Sentences[currentIndex];

  // 初始化句子文字
  part1.textContent = sentence.part1;
  part2.textContent = "______";
  part2.style.color = "#333";
  part2.style.fontWeight = "bold";
  part3.textContent = sentence.part3;

  // 隱藏中間車廂圖、重置火車位置
  car2Img.style.visibility = "hidden";
  train.style.transform = "translateX(0)";

  // 更新進度與訊息
  progressTracker.textContent = `關卡：${correctCount} / ${totalQuestions}`;
  message.textContent = "";

  // 初始化詞語選項
  wordOptions.forEach((el, i) => {
    el.textContent = sentence.options[i];
    el.dataset.word = sentence.options[i];
    el.style.backgroundColor = "#fff8dc";

    el.setAttribute("draggable", true);
    el.ondragstart = (e) => {
      e.dataTransfer.setData("text", el.dataset.word);
    };
    el.onclick = null;
  });

  speakSentence(sentence);
}

function speakSentence(sentence) {
  const utterance = new SpeechSynthesisUtterance(
    `${sentence.part1} ${sentence.part2} ${sentence.part3}`
  );
  utterance.lang = "zh-HK";
  utterance.rate = 0.9;
  speechSynthesis.speak(utterance);
}

function allowDrop(event) {
  event.preventDefault();
  part2.classList.add("drag-over");
}

function drop(event) {
  event.preventDefault();
  part2.classList.remove("drag-over");

  const word = event.dataTransfer.getData("text");
  const sentence = level2Sentences[currentIndex];

  if (word === sentence.part2) {
    // 答對：顯示車廂圖 + 火車移動
    part2.textContent = word;
    part2.style.color = "#333";
    car2Img.style.visibility = "visible";
    train.style.transform = "translateX(500px)";
    trainSound.play();
    correctCount++;

    setTimeout(() => {
      currentIndex++;
      if (currentIndex < totalQuestions) {
        initGame();
      } else {
        showFinalMessage();
      }
    }, 1500);
  } else {
    // 答錯：提示紅字，車廂不顯示
    part2.textContent = word;
    part2.style.color = "crimson";
    part2.style.fontWeight = "bold";
    failSound.play();
    train.style.transform = "translateX(0)";

    setTimeout(() => {
      part2.textContent = "______";
      part2.style.color = "#333";
      part2.style.fontWeight = "bold";
    }, 1500);
  }
}

function showFinalMessage() {
  if (correctCount >= passThreshold) {
    message.innerHTML = `🎉 你完成了 ${correctCount} / ${totalQuestions} 題，成功過關！`;
  } else {
    message.innerHTML = `😢 你只完成了 ${correctCount} / ${totalQuestions} 題，未能過關。`;
  }
}

// 再聽一次按鈕
replayBtn.addEventListener("click", () => {
  const sentence = level2Sentences[currentIndex];
  speakSentence(sentence);
});

// 設定拖放區（保險）
part2.addEventListener("drop", drop);
part2.addEventListener("dragover", allowDrop);


// 啟動遊戲
initGame();
