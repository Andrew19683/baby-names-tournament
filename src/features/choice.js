const divName1Node = document.getElementById("name-card-1");
const name1Node = divName1Node.querySelector(".name-card__text");
const divName2Node = document.getElementById("name-card-2");
const name2Node = divName2Node.querySelector(".name-card__text");
const btnChooseNode = document.getElementById("choose-btn");

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
    name2Node.textContent = match.player2.name;
  } else {
    name1Node.textContent = match.player2.name;
    name2Node.textContent = match.player1.name;
  }
  document.querySelector(".limit-message__title").classList.add("hidden");
  document.querySelector(".limit-message__subtitle").classList.add("hidden");

  divName1Node.addEventListener("click", function () {
    divName1Node.classList.add("name-card--selected");
    divName2Node.classList.remove("name-card--selected");
    btnChooseNode.disabled = false;
    console.log(
      `Будем считать, что ${name1Node.textContent} одерживает победу`,
    );
  });

  divName2Node.addEventListener("click", function () {
    divName2Node.classList.add("name-card--selected");
    divName1Node.classList.remove("name-card--selected");
    btnChooseNode.disabled = false;
    console.log(
      `Будем считать, что ${name2Node.textContent} одерживает победу`,
    );
  });
}

renderMatch(getRandomMatch());
