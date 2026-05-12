import {
  generateMatches,
  startTournament,
  playByeMatches,
} from "./tournament.js";

const names = JSON.parse(localStorage.getItem("names")) || [];

const inputBoyNode = document.getElementById("boys-input");
inputBoyNode.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    btnAddBoy.click();
  }
});
const inputGirlNode = document.getElementById("girls-input");
inputGirlNode.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    btnAddGirl.click();
  }
});
const btnAddBoy = document.getElementById("boys-add-btn");
const btnAddGirl = document.getElementById("girls-add-btn");
const ulBoysNode = document.getElementById("boys-list");
const ulGirlsNode = document.getElementById("girls-list");
const spanBoysCounterNode = document.getElementById("boys-count");
const spanGirlsCounterNode = document.getElementById("girls-count");
const btnStartTournament = document.getElementById("finish-btn");

class Name {
  constructor(name, gender, grid = "upper") {
    this.name = name;
    this.gender = gender;
    // this.round = round; // заметил, что я round не использую нигде с именами. Пока коммент
    this.grid = grid; // вероятно, это тоже можно удалить
    // стоит добавить description, который будет редактироваться даже после завершения добавления имён
  }
}

function saveNames(names) {
  localStorage.setItem("names", JSON.stringify(names));
}

function printBoys() {
  ulBoysNode.innerHTML = "";
  const boyNames = names.filter((name) => name.gender === "m");
  boyNames.forEach((name) => {
    const li = document.createElement("li");
    li.classList.add("name-item");
    li.id = `name-${name.name}`;
    const span = document.createElement("span");
    span.classList.add("name-text");
    span.textContent = name.name;
    const btnDel = document.createElement("button");
    btnDel.classList.add("remove-btn");
    btnDel.setAttribute("aria-label", "Удалить");
    btnDel.textContent = "✕";
    btnDel.id = `delete-${name.name}`;
    btnDel.addEventListener("click", function () {
      const index = names.findIndex((n) => n.name === name.name);
      if (index !== -1) {
        names.splice(index, 1);
        saveNames(names);
        printBoys();
      }
    });

    li.appendChild(span);
    li.appendChild(btnDel);
    ulBoysNode.appendChild(li);
  });
  spanBoysCounterNode.textContent = boyNames.length;
}

function printGirls() {
  ulGirlsNode.innerHTML = "";
  const girlNames = names.filter((name) => name.gender === "f");
  girlNames.forEach((name) => {
    const li = document.createElement("li");
    li.classList.add("name-item");
    li.id = `name-${name.name}`;
    const span = document.createElement("span");
    span.classList.add("name-text");
    span.textContent = name.name;
    const btnDel = document.createElement("button");
    btnDel.classList.add("remove-btn");
    btnDel.setAttribute("aria-label", "Удалить");
    btnDel.textContent = "✕";
    btnDel.id = `delete-${name.name}`;
    btnDel.addEventListener("click", function () {
      const index = names.findIndex((n) => n.name === name.name);
      if (index !== -1) {
        names.splice(index, 1);
        saveNames(names);
        printGirls();
      }
    });

    li.appendChild(span);
    li.appendChild(btnDel);
    ulGirlsNode.appendChild(li);
  });
  spanGirlsCounterNode.textContent = girlNames.length;
}

btnAddBoy.addEventListener("click", function () {
  const inputValue = inputBoyNode.value
    .trim()
    .toLowerCase()
    .split(/[\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");

  if (names.some((n) => n.name === inputValue)) {
    alert("Такое имя уже есть!");
    return;
  }

  if (!inputValue) {
    return;
  }

  const name = new Name(inputValue, "m", 0, "upper");

  names.push(name);
  saveNames(names);
  printBoys();

  inputBoyNode.value = "";
});

btnAddGirl.addEventListener("click", function () {
  const inputValue = inputGirlNode.value
    .trim()
    .toLowerCase()
    .split(/[\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");

  if (names.some((n) => n.name === inputValue)) {
    alert("Такое имя уже есть!");
    return;
  }

  if (!inputValue) {
    return;
  }

  const name = new Name(inputValue, "f", 0, "upper");

  names.push(name);
  saveNames(names);
  printGirls();

  inputGirlNode.value = "";
});

btnStartTournament.addEventListener("click", function () {
  const boys = names.filter((name) => name.gender === "m");
  const girls = names.filter((name) => name.gender === "f");
  startTournament(boys);
  startTournament(girls);
  saveNames([...boys, ...girls]);
  const matches = {};
  matches.boys = generateMatches(boys, "m");
  matches.girls = generateMatches(girls, "f");
  playByeMatches(matches); //  сразу сыграем матчи, где есть bye
  localStorage.setItem("matches", JSON.stringify(matches));
  window.location.href = "choice.html";
});

printBoys();
printGirls();
