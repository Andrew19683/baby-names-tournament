import { findMatchById } from "./tournament.js";

const divName1Node = document.getElementById("name-card-1");
const name1Node = divName1Node.querySelector(".name-card__text");
const divName2Node = document.getElementById("name-card-2");
const name2Node = divName2Node.querySelector(".name-card__text");
const btnChooseNode = document.getElementById("choose-btn");
divName1Node.addEventListener("click", leftChoiceClick);
divName2Node.addEventListener("click", rightChoiceClick);
btnChooseNode.addEventListener("click", setMatchResult);

let winnerId;
let loserId;

function getRandomMatch() {
  const matches = JSON.parse(localStorage.getItem("matches"));
  const allMatches = [...matches.boys, ...matches.girls];
  const currentMatch = allMatches.find(
    (match) => match.status === "currentMatch",
  );
  if (currentMatch) {
    console.log(currentMatch);
    return currentMatch;
  }
  const possibleMatches = allMatches.filter(
    (match) => match.status === "readyToPlay",
  );
  const randomMatch =
    possibleMatches[Math.floor(Math.random() * possibleMatches.length)];
  randomMatch.status = "currentMatch";
  console.log(randomMatch);
  localStorage.setItem("matches", JSON.stringify(matches));
  return randomMatch;
}

function renderMatch(match) {
  document.body.classList.add(
    match.gender === "m" ? "gender-boys" : "gender-girls",
  );

  const isNamesShuffled = Math.random() > 0.5 ? false : true;
  if (isNamesShuffled) {
    name1Node.textContent = match.player1.name;
    divName1Node.dataset.playerId = match.player1.id;
    name2Node.textContent = match.player2.name;
    divName2Node.dataset.playerId = match.player2.id;
  } else {
    name1Node.textContent = match.player2.name;
    divName1Node.dataset.playerId = match.player2.id;
    name2Node.textContent = match.player1.name;
    divName2Node.dataset.playerId = match.player1.id;
  }
  document.querySelector(".limit-message__title").classList.add("hidden");
  document.querySelector(".limit-message__subtitle").classList.add("hidden");
}

function leftChoiceClick() {
  divName1Node.classList.add("name-card--selected");
  divName2Node.classList.remove("name-card--selected");
  btnChooseNode.disabled = false;

  winnerId = divName1Node.dataset.playerId;
  loserId = divName2Node.dataset.playerId;
}

function rightChoiceClick() {
  divName2Node.classList.add("name-card--selected");
  divName1Node.classList.remove("name-card--selected");
  btnChooseNode.disabled = false;

  winnerId = divName2Node.dataset.playerId;
  loserId = divName1Node.dataset.playerId;
}

function setMatchResult() {
  // сперва найдем текущий матч
  const matches = JSON.parse(localStorage.getItem("matches"));
  const currentMatch =
    matches.boys.find((match) => match.status === "currentMatch") ||
    matches.girls.find((match) => match.status === "currentMatch");

  // завершим матч и явно пропишем победителя и проигравшего
  currentMatch.status = "finished";
  currentMatch.winner =
    winnerId == currentMatch.player1.id
      ? currentMatch.player1
      : currentMatch.player2;
  currentMatch.loser =
    loserId == currentMatch.player1.id
      ? currentMatch.player1
      : currentMatch.player2;
  console.log(currentMatch);

  // если это был гранд финал, то получаем победителя и завершаем функцию
  if (currentMatch.id === 1000) {
    console.log(
      `Победа в турнире имён за ${winnerId == currentMatch.player1.id ? currentMatch.player1.name : currentMatch.player2.name}! Поздравляем!!!`,
    );
    localStorage.setItem("matches", JSON.stringify(matches));
    return;
  }

  // переместим победителя в нужный матч
  const winnerGoesMatch = findMatchById(
    matches,
    currentMatch.gender,
    currentMatch.winnerGoesId,
  );
  if (!winnerGoesMatch.player1) {
    winnerGoesMatch.player1 =
      winnerId == currentMatch.player1.id
        ? currentMatch.player1
        : currentMatch.player2;
  } else {
    winnerGoesMatch.player2 =
      winnerId == currentMatch.player1.id
        ? currentMatch.player1
        : currentMatch.player2;
    winnerGoesMatch.status = "readyToPlay";
  }
  // и проигравшего
  if (currentMatch.loserGoesId) {
    const loserGoesMatch = findMatchById(
      matches,
      currentMatch.gender,
      currentMatch.loserGoesId,
    );
    if (!loserGoesMatch.player1) {
      loserGoesMatch.player1 =
        loserId == currentMatch.player1.id
          ? currentMatch.player1
          : currentMatch.player2;
    } else {
      loserGoesMatch.player2 =
        loserId == currentMatch.player1.id
          ? currentMatch.player1
          : currentMatch.player2;
      loserGoesMatch.status = "readyToPlay";
    }
  }
  localStorage.setItem("matches", JSON.stringify(matches));
}

renderMatch(getRandomMatch());
