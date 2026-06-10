const cards = [];

let currentIndex = 0;
let isAnswerVisible = false;
let score = 0;

const flashcard = document.getElementById("flashcard");
const cardText = document.getElementById("cardText");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("scoreText");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");
const showAnswerButton = document.getElementById("showAnswerButton");
const correctButton = document.getElementById("correctButton");
const incorrectButton = document.getElementById("incorrectButton");
const addCardForm = document.getElementById("addCardForm");
const newQuestion = document.getElementById("newQuestion");
const newAnswer = document.getElementById("newAnswer");

function updateDisplay() {
  if (cards.length === 0) {
    cardText.textContent = "Add a card to start the quiz.";
    cardText.parentElement.setAttribute("aria-label", "No flashcards available");
    progressText.textContent = `0 / 0`;
    scoreText.textContent = score;
    prevButton.disabled = true;
    nextButton.disabled = true;
    showAnswerButton.disabled = true;
    correctButton.disabled = true;
    incorrectButton.disabled = true;
    showAnswerButton.textContent = "Show Answer";
    return;
  }

  const card = cards[currentIndex];
  cardText.textContent = isAnswerVisible ? card.answer : card.question;
  cardText.parentElement.setAttribute("aria-label", isAnswerVisible ? "Flashcard answer" : "Flashcard question");
  progressText.textContent = `${currentIndex + 1} / ${cards.length}`;
  scoreText.textContent = score;
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === cards.length - 1;
  showAnswerButton.disabled = false;
  correctButton.disabled = false;
  incorrectButton.disabled = false;
  showAnswerButton.textContent = isAnswerVisible ? "Hide Answer" : "Show Answer";
}

function showAnswer() {
  if (cards.length === 0) return;
  isAnswerVisible = true;
  updateDisplay();
}

function toggleAnswer() {
  if (cards.length === 0) return;
  isAnswerVisible = !isAnswerVisible;
  updateDisplay();
}

function goToCard(index) {
  if (index < 0 || index >= cards.length) return;
  currentIndex = index;
  isAnswerVisible = false;
  updateDisplay();
}

function handleFeedback(isCorrect) {
  if (isCorrect) score += 1;
  if (currentIndex < cards.length - 1) {
    currentIndex += 1;
    isAnswerVisible = false;
  } else {
    alert(`Quiz complete! Your score is ${score} out of ${cards.length}.`);
    currentIndex = 0;
    isAnswerVisible = false;
    score = 0;
  }
  updateDisplay();
}

function addNewCard(event) {
  event.preventDefault();
  const question = newQuestion.value.trim();
  const answer = newAnswer.value.trim();
  if (!question || !answer) return;

  cards.push({ question, answer });
  newQuestion.value = "";
  newAnswer.value = "";
  currentIndex = cards.length - 1;
  isAnswerVisible = false;
  updateDisplay();
}

flashcard.addEventListener("click", toggleAnswer);
flashcard.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleAnswer();
  }
});
prevButton.addEventListener("click", () => goToCard(currentIndex - 1));
nextButton.addEventListener("click", () => goToCard(currentIndex + 1));
showAnswerButton.addEventListener("click", showAnswer);
correctButton.addEventListener("click", () => handleFeedback(true));
incorrectButton.addEventListener("click", () => handleFeedback(false));
addCardForm.addEventListener("submit", addNewCard);

updateDisplay();
