
import { db, collection, addDoc } from "./firebaseConfig.js";

const questions = [
  {
    question: "HTML stands for?",
    answers: [
      { text: "Hyper Text Makeup Language", correct: false },
      { text: "Hyper Text Markup Language", correct: true },
      { text: "Hyper Tool Mark Language", correct: false },
    ],
  },
  {
    question: "CSS stands for?",
    answers: [
      { text: "Cascoding Style Sheets", correct: false },
      { text: "Cascading Style Sheets", correct: true },
      { text: "Cascating Style Sheets", correct: false },
    ],
  },
  {
    question: "push() method adds element at the start of array.",
    answers: [
      { text: "True", correct: false },
      { text: "False", correct: true },
      { text: "None of above", correct: false },
    ],
  },
  {
    question: "Which tag is used to make element unique?",
    answers: [
      { text: "id", correct: true },
      { text: "class", correct: false },
      { text: "label", correct: false },
    ],
  },
  {
    question: "CSS can be used with ______ methods.",
    answers: [
      { text: "8", correct: false },
      { text: "3", correct: true },
      { text: "4", correct: false },
    ],
  },
  {
    question: "In JS, variable types are ____________.",
    answers: [
      { text: "6", correct: false },
      { text: "3", correct: false },
      { text: "8", correct: true },
    ],
  },
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  showQuestion();
}

async function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = `${questionNo}. ${currentQuestion.question}`;

  try {
    await addDoc(collection(db, "questions"), {
      questionNo,
      question: currentQuestion.question,
      answers: currentQuestion.answers.map((a) => a.text),
      time: new Date(),
    });
    console.log("Question saved!");
  } catch (e) {
    console.error("Error saving question:", e);
  }

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerButtons.appendChild(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  });
}

function resetState() {
  nextButton.style.display = "none";
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

async function selectAnswer(e) {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  const questionText = questions[currentQuestionIndex].question;

  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }

  try {
    await addDoc(collection(db, "answers"), {
      question: questionText,
      selectedAnswer: selectedBtn.innerText,
      correct: isCorrect,
      time: new Date(),
    });
    console.log("Answer saved!");
  } catch (e) {
    console.error("Error saving answer:", e);
  }

  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextButton.style.display = "block";
}

async function showScore() {
  resetState();
  questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";


  try {
    await addDoc(collection(db, "results"), {
      score,
      totalQuestions: questions.length,
      time: new Date(),
    });
    console.log("Result saved!");
  } catch (e) {
    console.error("Error saving result:", e);
  }
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});

startQuiz();
