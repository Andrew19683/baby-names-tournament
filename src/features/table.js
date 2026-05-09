import { generateMatches, startTournament } from "./tournament.js";

const names = JSON.parse(localStorage.getItem("names")) || [];

const inputBoyNode = document.getElementById("boys-input");
const inputGirlNode = document.getElementById("girls-input");
const btnAddBoy = document.getElementById("boys-add-btn");
const btnAddGirl = document.getElementById("girls-add-btn");
const ulBoysNode = document.getElementById("boys-list");
const ulGirlsNode = document.getElementById("girls-list");
const spanBoysCounterNode = document.getElementById("boys-count");
const spanGirlsCounterNode = document.getElementById("girls-count");

class Name {
  constructor(name, gender, round = 0, grid = "upper") {
    this.name = name;
    this.gender = gender;
    this.round = round;
    this.grid = grid;
  }
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
        localStorage.setItem("names", JSON.stringify(NAMES));
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
        localStorage.setItem("names", JSON.stringify(names));
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
  const inputValue = inputBoyNode.value;

  if (!inputValue) {
    return;
  }

  const name = new Name(inputValue, "m", 0, "upper");

  names.push(name);
  localStorage.setItem("names", JSON.stringify(names));
  printBoys();
});

btnAddGirl.addEventListener("click", function () {
  const inputValue = inputGirlNode.value;

  if (!inputValue) {
    return;
  }

  const name = new Name(inputValue, "f", 0, "upper");

  names.push(name);
  localStorage.setItem("names", JSON.stringify(names));
  printGirls();
});

printBoys();
printGirls();

startTournament(names);
generateMatches(names);
