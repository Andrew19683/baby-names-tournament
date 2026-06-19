import {
  generateMatches,
  startTournament,
  playByeMatches,
} from "./tournament.js";
import { exportData, importData } from "./backup.js";
import type { Name, Match, Matches } from "./types.js";

const names = JSON.parse(localStorage.getItem("names") ?? "null") || [];

const inputBoyNode = document.getElementById("boys-input") as HTMLInputElement;
inputBoyNode.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    btnAddBoy!.click();
  }
});
const inputGirlNode = document.getElementById(
  "girls-input",
) as HTMLInputElement;
inputGirlNode.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    btnAddGirl.click();
  }
});
const btnAddBoy = document.getElementById("boys-add-btn") as HTMLButtonElement;
const btnAddGirl = document.getElementById(
  "girls-add-btn",
) as HTMLButtonElement;
const ulBoysNode = document.getElementById("boys-list") as HTMLUListElement;
const ulGirlsNode = document.getElementById("girls-list") as HTMLUListElement;
const spanBoysCounterNode = document.getElementById(
  "boys-count",
) as HTMLElement;
const spanGirlsCounterNode = document.getElementById(
  "girls-count",
) as HTMLElement;
const btnStartTournament = document.getElementById(
  "finish-btn",
) as HTMLButtonElement;
const btnExport = document.getElementById("export-btn") as HTMLButtonElement;
btnExport.addEventListener("click", exportData);
const inputImport = document.getElementById("import-input") as HTMLInputElement;
inputImport.addEventListener("change", (event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) importData(target.files[0]);
});

function saveNames(names: Name[]) {
  localStorage.setItem("names", JSON.stringify(names));
}

function printBoys() {
  ulBoysNode.innerHTML = "";
  const boyNames = names.filter((name: Name) => name.gender === "boy");
  boyNames.forEach((name: Name) => {
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
      const index = names.findIndex((n: Name) => n.name === name.name);
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
  const girlNames = names.filter((name: Name) => name.gender === "girl");
  girlNames.forEach((name: Name) => {
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
      const index = names.findIndex((n: Name) => n.name === name.name);
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

  if (names.some((n: Name) => n.name === inputValue)) {
    alert("Такое имя уже есть!");
    return;
  }

  if (!inputValue) {
    return;
  }

  const name: Name = {
    name: inputValue,
    gender: "boy",
    id: 0,
  };

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

  if (names.some((n: Name) => n.name === inputValue)) {
    alert("Такое имя уже есть!");
    return;
  }

  if (!inputValue) {
    return;
  }

  const name: Name = {
    name: inputValue,
    gender: "girl",
    id: 0,
  };

  names.push(name);
  saveNames(names);
  printGirls();

  inputGirlNode.value = "";
});

btnStartTournament.addEventListener("click", function () {
  const boys = names.filter((name: Name) => name.gender === "boy");
  const girls = names.filter((name: Name) => name.gender === "girl");
  startTournament(boys, "boy");
  startTournament(girls, "girl");
  saveNames([...boys, ...girls]);
  const matches = {} as Matches;
  matches.boys = generateMatches(boys, "boys");
  matches.girls = generateMatches(girls, "girls");
  playByeMatches(matches); //  сразу сыграем матчи, где есть bye
  localStorage.setItem("matches", JSON.stringify(matches));
  window.location.href = "choice.html";
});

printBoys();
printGirls();
