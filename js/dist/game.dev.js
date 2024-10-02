// import data from "./js/data.json" assert {type: 'json'};
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var progressCount = document.querySelector(".progress-count");
var scoreText = document.querySelector(".score-text");
var progressbar = document.querySelector(".progressbar");
var progressbarFull = document.querySelector(".progressbar-full");
var loader = document.querySelector(".loader");
var container = document.querySelector(".container");
var questionEl = document.querySelector(".question");
var nextEl = document.getElementById("next");
var choices = Array.from(document.getElementsByClassName("choice-text"));
var spanEl = Array.from(document.querySelectorAll(".choice-container span"));
var acceptingAnswers = false,
    score = 0,
    questionCounter = 0,
    availableQuestions = [],
    currentQuestion = {},
    data = [];
var CORRECT_BONUS = 10;
var MAX_QUESTION = 20;

function getWindowsParam() {
  var urlParams = new URLSearchParams(window.location.search);
  var cat = urlParams.get("category");
  return cat;
}

function buildRequestUrl(categoryNumber) {
  return "https://opentdb.com/api.php?amount=".concat(MAX_QUESTION, "&category=").concat(categoryNumber, "&difficulty=easy&type=multiple");
}

function requestData(url) {
  var res, dataRes, formatedData;
  return regeneratorRuntime.async(function requestData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(fetch(url));

        case 3:
          res = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(res.json());

        case 6:
          dataRes = _context.sent;
          data = dataRes.results;

          if (!(data.length === 0)) {
            _context.next = 10;
            break;
          }

          throw new Error("Cannot access the data!");

        case 10:
          formatedData = formatData(data);
          availableQuestions = _toConsumableArray(formatedData);
          startGame();
          _context.next = 18;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          // console.error("Cannot fetch the data!");
          openAlertModal(_context.t0.message);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
}

function openAlertModal(message) {
  var divEl = document.createElement("div");
  var pEl = document.createElement("p");
  var buttonEl = document.createElement("button");
  pEl.innerHTML = "<i class=\"fa-solid fa-circle-exclamation fa-lg\" style=\"color:rgb(var(--error))\"></i> ".concat(message);
  divEl.classList.add("alert", "open");
  buttonEl.textContent = "Back to Home";
  buttonEl.classList.add("btn");
  divEl.appendChild(pEl);
  divEl.appendChild(buttonEl);
  document.body.appendChild(divEl);
  buttonEl.addEventListener("click", function () {
    divEl.classList.remove("open");
    return window.location.assign("./index.html");
  });
}

function processData() {
  var categoryNumber, url;
  return regeneratorRuntime.async(function processData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          categoryNumber = getWindowsParam();
          url = buildRequestUrl(categoryNumber) || "./data.json";
          _context2.next = 4;
          return regeneratorRuntime.awrap(requestData(url));

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
}

processData(); // fetch("./data.json").then( res=>{
//     return res.json()
// }).then (loadedData=> {
//     data = loadedData.results;
//     startGame()
// }).catch (err=>{
//     console.err (err);
// })

function startGame(e) {
  questionCounter = 0;
  score = 0;
  getNewQuestion();
  loader.classList.add("hidden");
  container.classList.remove("hidden");
}

function decode(str) {
  var textareaEl = document.createElement("textarea");
  textareaEl.innerHTML = str;
  return textareaEl.value;
}

function formatData(data) {
  var questions = data.map(function (obj) {
    var newObj = {
      question: decode(obj.question)
    };
    var correctAnswerNumber = Math.floor(Math.random() * 4);

    var answers = _toConsumableArray(obj.incorrect_answers);

    answers.splice(correctAnswerNumber, 0, obj.correct_answer);
    answers.forEach(function (element, index) {
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

choices.forEach(function (choice) {
  choice.addEventListener("click", function (e) {
    if (acceptingAnswers) {
      checkAnswer(e.target);
      acceptingAnswers = false;
    }
  });
});
nextEl.addEventListener("click", function (e) {
  acceptingAnswers = false;
  getNewQuestion();
});

function checkAnswer(targetEl) {
  var num = targetEl.dataset["number"];
  var classToApply = num === currentQuestion.correctAnswer ? "success" : "error";
  targetEl.parentElement.classList.add(classToApply);
  spanEl.forEach(function (span) {
    if (span.dataset["number"] === num) {
      var spanValue = num === currentQuestion.correctAnswer ? "<i class= \"fa-regular fa-circle-check \"  style=\"color:rgb(var(--success))\"></i>" : "<i class=\"fa-regular  fa-circle-xmark\"   style=\"color:rgb(var(--error))\"></i>";
      span.innerHTML = spanValue;
    }
  });
  score += num === currentQuestion.correctAnswer ? CORRECT_BONUS : 0;
  renderScore();
  nextEl.focus();
}

function renderScore() {
  scoreText.textContent = ": ".concat(score);
}

function renderQuestionCounter() {
  progressCount.textContent = " ".concat(questionCounter, "/").concat(MAX_QUESTION, " ");
  progressbarFull.style.width = "".concat(questionCounter / MAX_QUESTION * 100, "%");
}

function renderQuestions() {
  questionEl.textContent = currentQuestion.question;
  spanEl.forEach(function (span) {
    span.textContent = "";
  });
  choices.forEach(function (item, index) {
    var num = item.dataset["number"];
    item.textContent = currentQuestion["choice" + num];
    item.parentElement.classList.remove("success");
    item.parentElement.classList.remove("error");
  });
}