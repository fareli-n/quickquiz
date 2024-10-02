"use strict";

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const usernameEl = document.querySelector("#username");
const lastScore = localStorage.getItem("lastScore") || 0;
const endScoreEl = document.querySelector(".end-score");
const endMessage = document.querySelector('.end-message')
const loader = document.querySelector(".loader");
const container = document.querySelector(".container");

function loadPage() {
  loader.classList.add("hidden");
  container.style.display = "";
}

const MAX_HIGH_SCORES = 5;
endScoreEl.textContent = lastScore;
endMessage.textContent = ( lastScore === "0") ? "Try Later!" : 
          (Number(lastScore) < 100) ? "Nice try!" : "Congradulations!"


function saveGoHome(e) {
  e.preventDefault();
  if (!usernameEl.value) {
    return window.location.assign("./index.html");
  }
  
  const scoreObj = {
    name: usernameEl.value,
    score: lastScore,
  };
  highScores.push(scoreObj);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(MAX_HIGH_SCORES);
  // sortArray(highScores);
  localStorage.setItem("highScores", JSON.stringify(highScores));
  return window.location.assign("./index.html");


}

function sortArray(arr) {
  let swapObj = {};
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i].score < arr[j].score) {
        swapObj = { ...arr[j] };
        arr[j] = { ...arr[i] };
        arr[i] = { ...swapObj };
      }
    }
  }
}
