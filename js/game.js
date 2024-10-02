// import data from "./js/data.json" assert {type: 'json'};
"use strict";
const progressCount = document.querySelector(".progress-count");
const scoreText = document.querySelector(".score-text");
const progressbar = document.querySelector(".progressbar");
const progressbarFull = document.querySelector(".progressbar-full");
const loader = document.querySelector (".loader")
const container = document.querySelector(".container");

const questionEl = document.querySelector(".question");
const nextEl = document.getElementById("next");
const a= document.getElementsByClassName("choice-text")
const choicesDiv = document.querySelectorAll('.choice')

const choices = Array.from(document.getElementsByClassName("choice-text"));
const spanEl = Array.from(document.querySelectorAll(".choice-container span"));
let acceptingAnswers = false,
  score = 0,
  questionCounter = 0,
  availableQuestions = [],
  currentQuestion = {},
  data = [];

const CORRECT_BONUS = 10;
const MAX_QUESTION = 20;

function getWindowsParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const cat = urlParams.get("category");
  return cat;
}
function buildRequestUrl(categoryNumber) {
  return `https://opentdb.com/api.php?amount=${MAX_QUESTION}&category=${categoryNumber}&difficulty=easy&type=multiple`;
}
async function requestData(url) {
  try {
    const res = await fetch(url);
    const dataRes = await res.json();
    data = dataRes.results;
    if (data.length === 0) {
      throw new Error("Cannot access the data!");
    }
    const formatedData = formatData(data);
    availableQuestions = [...formatedData];
    startGame();
  } catch(e) {
    // console.error("Cannot fetch the data!");
    openAlertModal(e.message);
  }
}
function openAlertModal(message) {
  const divEl = document.createElement("div");
  const pEl = document.createElement("p")
  const buttonEl = document.createElement("button")
  pEl.innerHTML = `<i class="fa-solid fa-circle-exclamation fa-lg" style="color:rgb(var(--error))"></i> ${message}`;
  divEl.classList.add("alert","open");
  buttonEl.textContent = "Back to Home"
  buttonEl.classList.add("btn")
  divEl.appendChild (pEl)
  divEl.appendChild (buttonEl)
  document.body.appendChild(divEl)

  buttonEl.addEventListener ("click", ()=>{
    divEl.classList.remove("open");
    return window.location.assign("./index.html");
  })
}

async function processData() {
  const categoryNumber = getWindowsParam();
  const url = buildRequestUrl(categoryNumber) || "./data.json";
  await requestData(url);
}

processData();



function startGame(e) {
  questionCounter = 0;
  score = 0;
  getNewQuestion();
  loader.classList.add("hidden");
  container.classList.remove("hidden");
}

function decode(str) {
  const textareaEl = document.createElement("textarea");
  textareaEl.innerHTML = str;
  return textareaEl.value;
}

function formatData(data) {
  const questions = data.map((obj) => {
    const newObj = {
      question: decode(obj.question),
    };
    // Generates random Number between 0-3 , Math.random() * (max - min) + min
    const correctAnswerNumber = Math.floor(Math.random() * 4);
    const answers = [...obj.incorrect_answers];
    answers.splice(correctAnswerNumber, 0, obj.correct_answer);
    answers.forEach((element, index) => {
      newObj["choice" + index] = decode(element);
    });
    newObj.correctAnswer = correctAnswerNumber.toString();
    return newObj;
  });
  return questions;
}

function getNewQuestion() {
  if (questionCounter > MAX_QUESTION || availableQuestions.length === 0) {
    localStorage.setItem("lastScore", score);
    return window.location.assign("./end.html");
  }
  questionCounter++;
  currentQuestion = availableQuestions[0];
  renderQuestions();
  renderQuestionCounter();
  availableQuestions.shift();
  acceptingAnswers = true;
}

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    e.stopPropagation();
    if (acceptingAnswers) {
       checkAnswer(e.target);
      acceptingAnswers = false;
    }
  });
});

nextEl.addEventListener("click", (e) => {
  e.stopPropagation()
  acceptingAnswers = false;
  getNewQuestion();
});

function checkAnswer(targetEl) {
  const num = targetEl.dataset["number"];
  const classToApply =
    num === currentQuestion.correctAnswer ? "success" : "error";
  targetEl.parentElement.classList.add(classToApply);
  spanEl.forEach((span) => {
    if (span.dataset["number"] === num) {
      const spanValue =
        num === currentQuestion.correctAnswer
          ? `<i class= "fa-regular fa-circle-check "  style="color:rgb(var(--success))"></i>`
          : `<i class="fa-regular  fa-circle-xmark"   style="color:rgb(var(--error))"></i>`;
      span.innerHTML = spanValue;
    }
  });
  score += num === currentQuestion.correctAnswer ? CORRECT_BONUS : 0;
  renderScore();
  nextEl.focus();
}
function renderScore() {
  scoreText.textContent = `: ${score}`;
}
function renderQuestionCounter() {
  progressCount.textContent = ` ${questionCounter}/${MAX_QUESTION} `;
  progressbarFull.style.width = `${(questionCounter / MAX_QUESTION) * 100}%`;
}

function renderQuestions() {
  questionEl.textContent = currentQuestion.question;
  spanEl.forEach((span) => {
    span.textContent = "";
  });
  choices.forEach(item => {
    const num = item.dataset["number"];
    item.textContent = currentQuestion["choice" + num];
    item.parentElement.classList.remove("success");
    item.parentElement.classList.remove("error");
  });
}
