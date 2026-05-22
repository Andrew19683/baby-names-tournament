import { findMatchById, resolveMatch, playByeMatches } from "./tournament.js";
import { exportData, importData } from "./backup.js";

const DAILY_LIMIT = 2; // можно конфигурировать, в будущем можно попробовать сделать её вычисляемой

// карточки имён
const divName1Node = document.getElementById("name-card-1");
const name1Node = divName1Node.querySelector(".name-card__text");
const divName2Node = document.getElementById("name-card-2");
const name2Node = divName2Node.querySelector(".name-card__text");
const btnChooseNode = document.getElementById("choose-btn");
divName1Node.addEventListener("click", leftChoiceClick);
divName2Node.addEventListener("click", rightChoiceClick);
btnChooseNode.addEventListener("click", setMatchResult);
const name1DescriptionNode = document.getElementById("desc-1");
const name2DescriptionNode = document.getElementById("desc-2");

// попап победы
const victoryPopup = document.getElementById("grand-final-popup");
victoryPopup.addEventListener("click", (e) => {
  if (e.target === victoryPopup) {
    victoryPopup.style.display = "none";
    location.reload();
  }
});

// экспорт-импорт
const btnExport = document.getElementById("export-btn");
btnExport.addEventListener("click", exportData);
const inputImport = document.getElementById("import-input");
inputImport.addEventListener("change", (event) => {
  importData(event.target.files[0]);
});

// добавление описания имени
const btnEdit1Node = document.getElementById("edit-btn-1");
btnEdit1Node.addEventListener("click", (event) => {
  currentEditingName = name1Node.textContent;
  openEditPopup(event);
});
const btnEdit2Node = document.getElementById("edit-btn-2");
btnEdit2Node.addEventListener("click", (event) => {
  currentEditingName = name2Node.textContent;
  openEditPopup(event);
});
const editPopup = document.getElementById("edit-popup");
editPopup.addEventListener("click", (e) => {
  if (e.target === editPopup) {
    closeEditPopup();
  }
});
const btnCancelEdit = document.getElementById("edit-cancel");
btnCancelEdit.addEventListener("click", closeEditPopup);
const textareaEdit = document.getElementById("edit-textarea");
const btnSaveEdit = document.getElementById("edit-save");
btnSaveEdit.addEventListener("click", () => {
  saveDescription(currentEditingName, textareaEdit.value);
  closeEditPopup();
  renderDescriptions();
});

// редирект на tournament при лимите
const linkToTournament = document.getElementById("tournament-link");
linkToTournament.addEventListener("click", () => {
  location.href = "tournament.html";
});

let winnerId; // для определения победившего имени
let loserId; // для определения проигравшего имени
let currentEditingName; // для определения какому имени редактируем описание

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function getRandomMatch() {
  // проверим на дневной счётчик
  const currentDate = new Date();
  if (
    isSameDay(currentDate, new Date(localStorage.getItem("lastPlayedDate")))
  ) {
    if (localStorage.getItem("todayCount") >= DAILY_LIMIT) {
      document
        .querySelector(".choice-wrapper")
        .classList.add("choice-wrapper--limit-reached");
      return;
    }
  } else {
    localStorage.setItem("todayCount", "0");
    localStorage.setItem("lastPlayedDate", currentDate.toDateString());
  }

  const matches = JSON.parse(localStorage.getItem("matches"));
  const allMatches = [...matches.boys, ...matches.girls];
  const currentMatch = allMatches.find(
    (match) => match.status === "currentMatch",
  );
  if (currentMatch) {
    return currentMatch;
  }
  const possibleMatches = allMatches.filter(
    (match) => match.status === "readyToPlay",
  );
  const randomMatch =
    possibleMatches[Math.floor(Math.random() * possibleMatches.length)];
  randomMatch.status = "currentMatch";
  localStorage.setItem("matches", JSON.stringify(matches));
  return randomMatch;
}

function renderMatch(match) {
  if (!match) {
    return;
  }

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
  renderDescriptions();
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
  // сперва сделаем стиль для победителя
  document
    .querySelector(".choice-wrapper")
    .classList.add("choice-wrapper--decided");

  // найдем текущий матч
  const matches = JSON.parse(localStorage.getItem("matches"));
  const currentMatch =
    matches.boys.find((match) => match.status === "currentMatch") ||
    matches.girls.find((match) => match.status === "currentMatch");

  const result = resolveMatch(
    matches,
    currentMatch.id,
    currentMatch.gender,
    winnerId,
    loserId,
  );

  // после резолва всегда ищем и играем доступные матчи, где игрок bye, если это был не гранд финал
  if (result) {
    playByeMatches(result);
  }

  // через секунду рефрешнем страницу, если это не гранд финал
  if (currentMatch.id !== 1000) {
    setTimeout(() => {
      location.reload();
    }, 1000);
  } else {
    const popup = document.getElementById("grand-final-popup");
    popup.querySelector(".popup__gender-label").textContent =
      `Победитель среди ${currentMatch.gender === "m" ? "мальчиков" : "девочек"}`;
    popup.querySelector(".popup__name").textContent =
      currentMatch.player1.id === winnerId
        ? currentMatch.player1.name
        : currentMatch.player2.name;
    popup.classList.add("popup--visible");
  }

  // добавим данные в счётчики
  localStorage.setItem("lastPlayedDate", new Date().toDateString());
  localStorage.setItem(
    "todayCount",
    (parseInt(localStorage.getItem("todayCount") || "0") + 1).toString(),
  );
}

function getDescription(name) {
  const descriptions = JSON.parse(localStorage.getItem("descriptions")) || {};
  return descriptions[name] || "";
}

function saveDescription(name, description) {
  const descriptions = JSON.parse(localStorage.getItem("descriptions")) || {};
  descriptions[name] = description;
  localStorage.setItem("descriptions", JSON.stringify(descriptions));
}

function openEditPopup(event) {
  event.stopPropagation();
  textareaEdit.value = getDescription(currentEditingName);
  editPopup.classList.add("popup--visible");
}

function closeEditPopup() {
  editPopup.classList.remove("popup--visible");
}

function renderDescriptions() {
  name1DescriptionNode.textContent = getDescription(name1Node.textContent);
  name2DescriptionNode.textContent = getDescription(name2Node.textContent);
}

if (window.location.pathname.includes("choice.html")) {
  renderMatch(getRandomMatch());
}
