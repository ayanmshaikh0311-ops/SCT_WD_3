const questions = [
  {
    type: "single",
    question: "Which language is used to create the structure of a web page?",
    options: ["Python", "HTML", "Java", "SQL"],
    answer: "HTML",
  },

  {
    type: "single",
    question: "Which language is mainly used to style web pages?",
    options: ["HTML", "CSS", "Python", "C++"],
    answer: "CSS",
  },

  {
    type: "multi",
    question: "Which of the following are JavaScript data types?",
    options: ["String", "Number", "Boolean", "HTML"],
    answer: ["String", "Number", "Boolean"],
  },

  {
    type: "fill",
    question: "Which keyword is used to declare a constant in JavaScript?",
    answer: "const",
  },

  {
    type: "single",
    question: "Which method is used to select an element by its ID?",
    options: [
      "getElementById()",
      "querySelectorAll()",
      "getElementsByClassName()",
      "createElement()",
    ],
    answer: "getElementById()",
  },
];

let currentQuestion = 0;

let userAnswers = new Array(questions.length).fill(null);

let score = 0;

/* DOM Elements */

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const questionNumberElement = document.getElementById("question-number");
const scoreElement = document.getElementById("score");
const progressElement = document.getElementById("progress");
const questionTypeElement = document.getElementById("question-type");
const feedbackElement = document.getElementById("feedback");
const previousButton = document.getElementById("previous-btn");
const nextButton = document.getElementById("next-btn");
const quizSection = document.getElementById("quiz-section");
const resultSection = document.getElementById("result-section");
const finalScoreElement = document.getElementById("final-score");
const resultMessageElement = document.getElementById("result-message");

/* Questions */

function loadQuestion() {
  const current = questions[currentQuestion];
  questionElement.textContent = current.question;
  optionsElement.innerHTML = "";
  feedbackElement.textContent = "";
  questionNumberElement.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  progressElement.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  questionTypeElement.textContent = getQuestionType(current.type);
  previousButton.disabled = currentQuestion === 0;

  if (currentQuestion === questions.length - 1) {
    nextButton.textContent = "Finish";
  } else {
    nextButton.textContent = "Next";
  }

  if (current.type === "single") {
    createSingleQuestion(current);
  } else if (current.type === "multi") {
    createMultiQuestion(current);
  } else if (current.type === "fill") {
    createFillQuestion(current);
  }
}

/* Question Type ( single, multi , fill) */

function getQuestionType(type) {
  if (type === "single") {
    return "Single Select";
  }

  if (type === "multi") {
    return "Multi Select";
  }

  if (type === "fill") {
    return "Fill in the Blank";
  }
}

/* Single Select */

function createSingleQuestion(question) {
  question.options.forEach((option) => {
    const button = document.createElement("button");

    button.classList.add("option");

    button.textContent = option;

    if (userAnswers[currentQuestion] === option) {
      button.classList.add("selected");
    }

    button.onclick = () => {
      userAnswers[currentQuestion] = option;

      document
        .querySelectorAll(".option")
        .forEach((btn) => btn.classList.remove("selected"));

      button.classList.add("selected");
    };

    optionsElement.appendChild(button);
  });
}

/* Multi Select */

function createMultiQuestion(question) {
  question.options.forEach((option) => {
    const button = document.createElement("button");

    button.classList.add("option");

    button.textContent = option;

    const savedAnswer = userAnswers[currentQuestion] || [];

    if (savedAnswer.includes(option)) {
      button.classList.add("selected");
    }

    button.onclick = () => {
      let answers = userAnswers[currentQuestion] || [];

      if (answers.includes(option)) {
        answers = answers.filter((answer) => answer !== option);

        button.classList.remove("selected");
      } else {
        answers.push(option);

        button.classList.add("selected");
      }

      userAnswers[currentQuestion] = answers;
    };

    optionsElement.appendChild(button);
  });
}

/* Fill in the Blank */

function createFillQuestion(question) {
  const input = document.createElement("input");

  input.type = "text";

  input.classList.add("fill-input");

  input.placeholder = "Type your answer...";

  input.value = userAnswers[currentQuestion] || "";

  input.addEventListener("input", () => {
    userAnswers[currentQuestion] = input.value.trim();
  });

  optionsElement.appendChild(input);
}

/* Next Question */

function nextQuestion() {
  if (!validateAnswer()) {
    feedbackElement.textContent = "Please select or enter an answer.";

    return;
  }

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;

    loadQuestion();
  } else {
    calculateScore();

    showResult();
  }
}

/* Previous Question */

function previousQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;

    loadQuestion();
  }
}

/* Validate Answer */

function validateAnswer() {
  const answer = userAnswers[currentQuestion];

  if (questions[currentQuestion].type === "multi") {
    return answer !== null && answer.length > 0;
  }

  return answer !== null && answer !== "";
}

/* Calculate Score */

function calculateScore() {
  score = 0;

  questions.forEach((question, index) => {
    const userAnswer = userAnswers[index];

    if (question.type === "single") {
      if (userAnswer === question.answer) {
        score++;
      }
    } else if (question.type === "multi") {
      if (
        Array.isArray(userAnswer) &&
        arraysEqual(userAnswer, question.answer)
      ) {
        score++;
      }
    } else if (question.type === "fill") {
      if (
        userAnswer &&
        userAnswer.toLowerCase() === question.answer.toLowerCase()
      ) {
        score++;
      }
    }
  });
}

/* Compare Arrays */

function arraysEqual(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }

  return array1.every((value) => array2.includes(value));
}

/* Show Result */

function showResult() {
  quizSection.style.display = "none";

  resultSection.style.display = "block";

  finalScoreElement.textContent = `${score} / ${questions.length}`;

  const percentage = (score / questions.length) * 100;

  if (percentage === 100) {
    resultMessageElement.textContent = "Excellent! Perfect score!";
  } else if (percentage >= 70) {
    resultMessageElement.textContent =
      "Great job! You have a good understanding.";
  } else if (percentage >= 50) {
    resultMessageElement.textContent = "Good effort! Keep practicing.";
  } else {
    resultMessageElement.textContent = "Keep learning and try again!";
  }
}

/* Restart game */

function restartQuiz() {
  currentQuestion = 0;

  score = 0;

  userAnswers = new Array(questions.length).fill(null);

  quizSection.style.display = "block";

  resultSection.style.display = "none";

  scoreElement.textContent = "Score: 0";

  loadQuestion();
}

/* Start Quiz */

loadQuestion();
