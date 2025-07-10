const part1 = document.getElementById("part1");
const blank = document.getElementById("blank");
const part3 = document.getElementById("part3");
const train = document.getElementById("train");
const replayBtn = document.getElementById("replayBtn");
const trainSound = document.getElementById("trainSound");
const failSound = document.getElementById("failSound");
const message = document.getElementById("message");
const wordOptions = document.querySelectorAll(".word-option");

let currentIndex = 0;
let correctCount = 0;
const totalQuestions = level2Sentences.length;
const passThreshold = Math.ceil(totalQuestions * 0.8); // 80%

function initGame() {
  const sentence = level2Sentences[currentIndex];

  part1.textContent = sentence.part1;
  part3.textContent = sentence.part3;
  blank.textContent = "______";
  train.style.transform = "translateX(0)";
document.getElementById("progressTracker").textContent = `關卡：${correctCount} / ${totalQuestions}`;
message.textContent = ""; // 清空訊息區


  wordOptions.forEach((el, i) => {
    el.textContent = sentence.options[i];
    el.dataset.word = sentence.options[i];
    el.style.backgroundColor = "#fff8dc";

    el.setAttribute("draggable", true);
    el.ondragstart = (e) => {
      e.dataTransfer.setData("text", el.dataset.word);
    };

    el.onclick = null; // 禁用點擊
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
  blank.classList.add("drag-over");
}

function drop(event) {
  event.preventDefault();
  blank.classList.remove("drag-over");

  const word = event.dataTransfer.getData("text");
  const sentence = level2Sentences[currentIndex];

  if (word === sentence.part2) {
    blank.textContent = word;
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
    blank.textContent = word;
    blank.style.color = "crimson";
    blank.style.fontWeight = "bold";
    failSound.play();

    // 1.5 秒後清除錯誤顯示
    setTimeout(() => {
      blank.textContent = "______";
      blank.style.color = "";
      blank.style.fontWeight = "";
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

replayBtn.addEventListener("click", () => {
  const sentence = level2Sentences[currentIndex];
  speakSentence(sentence);
});

initGame();
