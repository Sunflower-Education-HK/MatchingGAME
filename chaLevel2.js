const part1 = document.getElementById("part1");
const part2 = document.getElementById("part2");
const part3 = document.getElementById("part3");
const part4 = document.getElementById("part4");
const train = document.getElementById("train");
const replayBtn = document.getElementById("replayBtn");
const trainSound = document.getElementById("trainSound");
const failSound = document.getElementById("failSound");
const message = document.getElementById("message");
const progressTracker = document.getElementById("progressTracker");
const car1Img = document.getElementById("car1Img");
const car2Img = document.getElementById("car2Img");
const car3Img = document.getElementById("car3Img");
const car4Img = document.getElementById("car4Img");
const wordArea = document.querySelector(".sky");

let currentIndex = 0;
let correctCount = 0;
let isProcessing = false;
const totalQuestions = level2Sentences.length;
const passThreshold = Math.ceil(totalQuestions * 0.8);

function initGame() {
  console.log("initGame called, currentIndex:", currentIndex);
  const sentence = level2Sentences[currentIndex];

  // 隨機選擇答案和留空位置
  const possibleAnswers = sentence.possibleAnswers;
  const answerText = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
  const answerIndex = sentence.possibleAnswers.indexOf(answerText);
  const options = sentence.options[answerText];

  part1.textContent = answerIndex === 0 ? "" : sentence.parts[0].text;
  part2.textContent = answerIndex === 1 ? "" : sentence.parts[1].text;
  part3.textContent = answerIndex === 2 ? "" : sentence.parts[2].text;
  part4.textContent = answerIndex === 3 ? "" : sentence.parts[3].text;

  // 設置拖放區域
  const dropZones = [part1, part2, part3, part4];
  dropZones.forEach((zone, index) => {
    zone.classList.remove("c-dropzone");
    zone.removeAttribute("ondrop");
    zone.removeAttribute("ondragover");
  });
  const dropZone = dropZones[answerIndex];
  dropZone.classList.add("c-dropzone");
  dropZone.setAttribute("ondrop", "drop(event)");
  dropZone.setAttribute("ondragover", "allowDrop(event)");
  dropZone.dataset.answer = answerText;

  // 控制路軌顯示
  car1Img.style.visibility = answerIndex === 0 ? "hidden" : "visible";
  car2Img.style.visibility = answerIndex === 1 ? "hidden" : "visible";
  car3Img.style.visibility = answerIndex === 2 ? "hidden" : "visible";
  car4Img.style.visibility = answerIndex === 3 ? "hidden" : "visible";

  train.style.transition = "none";
  train.style.transform = "translateX(0)";
  setTimeout(() => {
    train.style.transition = "transform 3s ease-out";
  }, 0);
  message.textContent = "";
  progressTracker.textContent = `關卡：${currentIndex + 1} / ${totalQuestions}`;

  wordArea.innerHTML = "";
  options.forEach(word => {
    const option = document.createElement("div");
    option.classList.add("word-option");
    option.dataset.word = word;

    const carImg = document.createElement("img");
    carImg.src = "img/b.png";
    carImg.classList.add("word-car");

    const label = document.createElement("div");
    label.classList.add("word-label");
    label.textContent = word;

    option.appendChild(carImg);
    option.appendChild(label);
    wordArea.appendChild(option);

    option.setAttribute("draggable", true);
    option.ondragstart = e => {
      e.dataTransfer.setData("text", word);
    };
  });

  const fullSentence = sentence.parts.map((part, index) => (index === answerIndex ? answerText : part.text)).join(" ");
  speakSentence({ part1: sentence.parts[0].text, part2: answerText, part3: sentence.parts[2].text, part4: sentence.parts[3].text });
}

function speakSentence(sentence) {
  const utterance = new SpeechSynthesisUtterance(
    `${sentence.part1} ${sentence.part2} ${sentence.part3} ${sentence.part4}`
  );
  utterance.lang = "zh-HK";
  utterance.rate = 0.9;
  speechSynthesis.cancel();
  setTimeout(() => {
    speechSynthesis.speak(utterance);
  }, 200);
}

function allowDrop(event) {
  event.preventDefault();
  event.target.closest(".c-dropzone").classList.add("drag-over");
}

function drop(event) {
  if (isProcessing) {
    console.log("Drop ignored: processing in progress");
    return;
  }
  isProcessing = true;
  console.log("Drop event triggered, currentIndex:", currentIndex);

  event.preventDefault();
  const dropZone = event.target.closest(".c-dropzone");
  dropZone.classList.remove("drag-over");

  const word = event.dataTransfer.getData("text");
  const correctAnswer = dropZone.dataset.answer;

  if (!word) {
    isProcessing = false;
    return;
  }

  dropZone.textContent = word;
  dropZone.style.color = "#333";

  wordArea.querySelectorAll(".word-option").forEach(option => {
    option.setAttribute("draggable", false);
  });

  if (word === correctAnswer) {
    // 顯示被隱藏的路軌
    const answerIndex = [part1, part2, part3, part4].indexOf(dropZone);
    if (answerIndex === 0) car1Img.style.visibility = "visible";
    if (answerIndex === 1) car2Img.style.visibility = "visible";
    if (answerIndex === 2) car3Img.style.visibility = "visible";
    if (answerIndex === 3) car4Img.style.visibility = "visible";

    const trainWidth = train.offsetWidth;
    const maxX = window.innerWidth + trainWidth;
    train.style.transform = `translateX(${maxX}px)`;

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
      isProcessing = false;
      wordArea.querySelectorAll(".word-option").forEach(option => {
        option.setAttribute("draggable", true);
      });
    }, 1500);
  } else {
    dropZone.style.color = "crimson";
    dropZone.style.fontWeight = "bold";
    dropZone.style.backgroundColor = "#ffe5e5";

    failSound.play();
    train.style.transition = "none";
    train.style.transform = "translateX(0)";
    setTimeout(() => {
      train.style.transition = "transform 3s ease-out";
    }, 0);

    setTimeout(() => {
      dropZone.textContent = "";
      dropZone.style.color = "#333";
      dropZone.style.fontWeight = "normal";
      dropZone.style.backgroundColor = "transparent";
      isProcessing = false;
      wordArea.querySelectorAll(".word-option").forEach(option => {
        option.setAttribute("draggable", true);
      });
    }, 1500);
  }
}

function showFinalMessage() {
  if (correctCount >= passThreshold) {
    message.innerHTML = `🎉 恭喜完成所有題目！你答啱咗 ${correctCount} / ${totalQuestions} 題，成功過關！`;
  } else {
    message.innerHTML = `😢 你完成咗所有題目，但只答啱 ${correctCount} / ${totalQuestions} 題，未能過關。`;
  }
}

replayBtn.addEventListener("click", () => {
  const sentence = level2Sentences[currentIndex];
  const answerText = part1.dataset.answer || part2.dataset.answer || part3.dataset.answer || part4.dataset.answer;
  speakSentence({ part1: sentence.parts[0].text, part2: sentence.parts[1].text, part3: sentence.parts[2].text, part4: answerText });
});

console.log("Initial level2Sentences:", level2Sentences);
initGame();