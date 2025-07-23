// 這裡可以加入更多互動效果
document.addEventListener("DOMContentLoaded", () => {
  const fish1 = document.getElementById("fish1");
  const fish5 = document.getElementById("fish5");

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
});

