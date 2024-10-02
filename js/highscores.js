
const loader = document.querySelector(".loader");
const container = document.querySelector(".container");

function loadPage() {
  loader.classList.add("hidden");
  container.style.display = "";
}

const scoresContainer = document.querySelector(".scores-container");
const highscores = JSON.parse(localStorage.getItem("highScores"));

const fragment = document.createDocumentFragment();
highscores.forEach((item) => {
  const divEl = document.createElement("div");
  const pEl = document.createElement("p");
  const spanEl = document.createElement("span");
  divEl.classList.add("scores-container_rows");
  pEl.classList.add("scores-text");
  pEl.textContent = item.name;
  spanEl.textContent = item.score;
  divEl.appendChild(pEl);
  divEl.appendChild(spanEl);
  fragment.appendChild(divEl);
});
scoresContainer.append(fragment);
