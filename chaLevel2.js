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
const passThreshold = Math.ceil(totalQuestions * 0.8);

function initGame() {
  const sentence = level2Sentences[currentIndex];

  // Set sentence parts
  part1.textContent = sentence.part1;
  part2.textContent = ""; // drop zone
  part2.style.color = "#333";
  part3.textContent = sentence.part3;

  // Reset visuals
  car2Img.style.visibility = "hidden";
  train.style.transform = "translateX(0)";
  message.textContent = "";
  progressTracker.textContent = `關卡：${currentIndex + 1} / ${totalQuestions}`;

  if (currentIndex === 0) {
  message.innerHTML = "👋 嘩～準備好搭語文小火車未？拖啱詞語就可以開車喇～！";
}


  // Update options
  wordOptions.forEach((el, i) => {
    el.querySelector(".word-label").textContent = sentence.options[i];
    el.dataset.word = sentence.options[i];
    el.setAttribute("draggable", true);
    el.ondragstart = (e) => {
      e.dataTransfer.setData("text", sentence.options[i]);
    };
  });

  // Speak the sentence immediately
  speakSentence(sentence);
}

function speakSentence(sentence) {
  const utterance = new SpeechSynthesisUtterance(
    `${sentence.part1} ${sentence.part2} ${sentence.part3}`
  );
  utterance.lang = "zh-HK";
  utterance.rate = 0.9;
  speechSynthesis.cancel(); // stop any ongoing speech
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

  part2.textContent = word;
  part2.style.color = "#333";

  if (word === sentence.part2) {
    car2Img.style.visibility = "visible";
    train.style.transform = `translateX(${window.innerWidth - 350}px)`;
    trainSound.currentTime = 0;
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
    part2.style.color = "crimson";
    failSound.play();
    train.style.transform = "translateX(0)";

    setTimeout(() => {
      part2.textContent = "";
      part2.style.color = "#333";
    }, 1500);
  }
}

function showFinalMessage() {
  // ✅ Only show message after ALL questions answered
  if (correctCount >= passThreshold) {
    message.innerHTML = `🎉 恭喜完成所有題目！你答啱咗 ${correctCount} / ${totalQuestions} 題，成功過關！`;
  } else {
    message.innerHTML = `😢 你完成咗所有題目，但只答啱 ${correctCount} / ${totalQuestions} 題，未能過關。`;
  }
}

replayBtn.addEventListener("click", () => {
  const sentence = level2Sentences[currentIndex];
  speakSentence(sentence);
});

part2.addEventListener("drop", drop);
part2.addEventListener("dragover", allowDrop);

initGame();
