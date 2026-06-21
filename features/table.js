import { generateMatches, startTournament, playByeMatches, } from "./tournament.js";
import { exportData, importData } from "./backup.js";
const names = JSON.parse(localStorage.getItem("names") ?? "null") || [];
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
const btnExport = document.getElementById("export-btn");
btnExport.addEventListener("click", exportData);
const inputImport = document.getElementById("import-input");
inputImport.addEventListener("change", (event) => {
    const target = event.target;
    if (target.files && target.files[0])
        importData(target.files[0]);
});
function saveNames(names) {
    localStorage.setItem("names", JSON.stringify(names));
}
function printBoys() {
    ulBoysNode.innerHTML = "";
    const boyNames = names.filter((name) => name.gender === "boy");
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
    const girlNames = names.filter((name) => name.gender === "girl");
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
    const name = {
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
    if (names.some((n) => n.name === inputValue)) {
        alert("Такое имя уже есть!");
        return;
    }
    if (!inputValue) {
        return;
    }
    const name = {
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
    const boys = names.filter((name) => name.gender === "boy");
    const girls = names.filter((name) => name.gender === "girl");
    startTournament(boys, "boy");
    startTournament(girls, "girl");
    saveNames([...boys, ...girls]);
    const matches = {};
    matches.boys = generateMatches(boys, "boys");
    matches.girls = generateMatches(girls, "girls");
    playByeMatches(matches); //  сразу сыграем матчи, где есть bye
    localStorage.setItem("matches", JSON.stringify(matches));
    window.location.href = "choice.html";
});
printBoys();
printGirls();
//# sourceMappingURL=table.js.map