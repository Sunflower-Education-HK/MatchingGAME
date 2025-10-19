document.addEventListener("DOMContentLoaded", () => {
  const fish1 = document.getElementById("fish1");
  const fish5 = document.getElementById("fish5");
  const recordButton = document.getElementById("recordButton");
  const engrecordButton = document.getElementById("engrecordButton");
  const level2Button = document.getElementById("level2Button");
  const englevel2Button = document.getElementById("englevel2Button");

  // 🐟 魚的懸停效果
  fish1.addEventListener("mouseover", () => {
    fish1.style.transform = "scale(1.2)";
  });
  fish1.addEventListener("mouseout", () => {
    fish1.style.transform = "scale(1)";
  });

  fish5.addEventListener("mouseover", () => {
    fish5.style.transform = "scale(1.2)";
  });
  fish5.addEventListener("mouseout", () => {
    fish5.style.transform = "scale(1)";
  });

  const resetProgressButton = document.getElementById("resetProgressButton");

  resetProgressButton.addEventListener("click", () => {
    localStorage.removeItem('zhCorrectCount');
    localStorage.removeItem('zhLevelProgress');
    alert("已重設進度～快啲再挑戰一次啦！");
    updateRecordDisplay();
  });

  document.getElementById("engResetButton").addEventListener("click", () => {
  // 清除英文進度（Level & Correct Count）
  localStorage.setItem("enLevelProgress", "1");
  localStorage.setItem("enCorrectCount", "0");

  // 更新畫面文字（如果你想即時顯示）
  const engRecordBtn = document.getElementById("engrecordButton");
  if (engRecordBtn) {
    engRecordBtn.textContent = "Correct: 0/40";
  }

  alert("English progress has been reset!");
});

  // 🎯 讀取並更新進度顯示（改用 localStorage）
  function updateRecordDisplay() {
    const zhCorrect = parseInt(localStorage.getItem('zhCorrectCount')) || 0;
    const enCorrect = parseInt(localStorage.getItem('enCorrectCount')) || 0;

    recordButton.textContent = `正確: ${zhCorrect}/40`;
    engrecordButton.textContent = `Correct: ${enCorrect}/40`;

    // 達到 8 成進度（即 32/40）顯示第二關
    level2Button.style.display = zhCorrect >= 32 ? 'block' : 'none';
    englevel2Button.style.display = enCorrect >= 32 ? 'block' : 'none';
  }

  // 🧪 顯示詳情按鈕提示
  recordButton.addEventListener('click', () => {
    const zhCorrect = parseInt(localStorage.getItem('zhCorrectCount')) || 0;
    alert(`中文正確: ${zhCorrect}/40`);
  });

  engrecordButton.addEventListener('click', () => {
    const enCorrect = parseInt(localStorage.getItem('enCorrectCount')) || 0;
    alert(`英文正確: ${enCorrect}/40`);
  });

  // 🧠 可選：在 Console 中測試儲存資料（開發用途）
  function testLocalStorage() {
    console.log("🎯 zhCorrectCount:", localStorage.getItem("zhCorrectCount"));
    console.log("🎯 enCorrectCount:", localStorage.getItem("enCorrectCount"));
    console.log("🎯 zhLevelProgress:", localStorage.getItem("zhLevelProgress"));
  }

  updateRecordDisplay();
});