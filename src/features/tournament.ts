// import validate from "./validate.js"; // для проверок генерации
import { exportData, importData } from "./backup.js";
import type {
  Gender,
  GenderPlural,
  Grid,
  Name,
  Match,
  Matches,
} from "./types.js";

const placeClasses = {
  1: "standings__place--gold",
  2: "standings__place--silver",
  3: "standings__place--bronze",
};

// Импорт/экспорт
const btnExport = document.getElementById("export-btn") as HTMLButtonElement;
btnExport.addEventListener("click", exportData);
const inputImport = document.getElementById("import-input") as HTMLInputElement;
inputImport.addEventListener("change", (event) => {
  const target = event.target;

  if (target instanceof HTMLInputElement && target.files?.[0]) {
    importData(target.files[0]);
  }
});

export function startTournament(names: Name[], gender: Gender) {
  // Вычисляем следующую степень двойки, которая больше или равна длине массива
  // За счёт этого определим вид турнира
  const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(names.length)));

  // Перемешиваем массив имен с помощью алгоритма Фишера-Йетса
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = names[i]!;
    names[i] = names[j]!;
    names[j] = temp;
  }
  // Добавляем "пустых" участников в конец массива через одного, пока число участников не станет степенью двойки
  while (names.length < nextPowerOfTwo) {
    const leftSlots = nextPowerOfTwo - names.length;
    names.splice(nextPowerOfTwo - 2 * leftSlots + 1, 0, {
      name: "Пусто",
      isBye: true,
      gender: gender,
      id: names.length,
    });
  }

  // Проставим каждому участнику его id
  names.forEach((name, index) => {
    name.id = index;
  });
  return names;
}

export function generateMatches(names: Name[], gender: GenderPlural) {
  // протестировал для 8 и 16 участников. Понятия не имею, как оно будет на других степенях двойки, но выглядит корректно
  const matches: Match[] = []; // сюда закидываем все созданные матчи
  let matchId = 0; // глобальный счетчик матчей верхней сетки
  let round = 1; // текущий раунд
  let loserMatchId = 100; // счетчик для матчей нижней сетки, начинаем с 100, чтобы не пересекаться с верхней сеткой

  let participatsForRound = names.length; // количество участников для текущего раунда

  // создаём матчи верхней сетки
  while (participatsForRound >= 2) {
    ({ matchId, nextLoserMatchId: loserMatchId } = generateUpperRound(
      matches,
      participatsForRound,
      matchId,
      round,
      loserMatchId,
      names,
      gender,
    ));
    participatsForRound /= 2;
    round++;
  }

  // создаём матчи нижней сетки
  matchId = 100; // начинаем с id 100 для нижней сетки
  round = 1; // раунды нижней сетки считаем заново
  participatsForRound = names.length / 2; // в нижней сетке изначально половина участников
  while (participatsForRound >= 2) {
    matchId = generateLowerRound(
      matches,
      participatsForRound,
      matchId,
      round,
      gender,
    );
    if (round % 2 === 0) {
      participatsForRound /= 2;
    }
    round++;
  }

  // и финальный матч
  matches.push({
    id: 1000,
    round: 1,
    player1: null,
    player2: null,
    gender: gender,
    status: "pending",
  });

  // validate(names.length, matches);
  return matches;
}

function generateUpperRound(
  matches: Match[],
  participants: number,
  matchId: number,
  round: number,
  nextLoserMatchId: number,
  names: Name[],
  gender: GenderPlural,
) {
  let finalMatch = false;
  let nextWinnerMatchId;
  if (participants === 2) {
    finalMatch = true;
  } else {
    nextWinnerMatchId = matchId + participants / 2;
  }

  if (round > 2) {
    nextLoserMatchId += participants / 2; // после 2 раунда в лузерах всегда будет дополнительный раунд между собой, который надо пропустить
  }

  for (let i = 0; i < participants / 2; i++) {
    const match = {
      id: matchId++,
      round: round,
      grid: "upper",
      gender: gender,
    } as Match;
    if (round === 1) {
      match.player1 = names[i]!;
      match.player2 = names[participants - 1 - i]!;
      match.status = "readyToPlay";
    } else {
      match.player1 = null;
      match.player2 = null;
      match.status = "pending";
    }
    if (!finalMatch) {
      match.winnerGoesId = Math.trunc(nextWinnerMatchId!);
      nextWinnerMatchId! += 0.5;
      if (round % 2 === 1) {
        match.loserGoesId = Math.trunc(nextLoserMatchId);
        if (round % 4 === 3) {
          nextLoserMatchId += 1;
        } else {
          nextLoserMatchId += 0.5;
        }
      } else {
        match.loserGoesId = Math.trunc(
          nextLoserMatchId + participants / 2 - i * 2 - 1, // закидываем в обратном порядке для чэтных раундов, чтобы уменьшить шанс повторной встречи участников
        );
        nextLoserMatchId += 1;
      }
    } else {
      match.isGridFinal = true;
      match.winnerGoesId = 1000; // id гранд финала
      match.loserGoesId = Math.trunc(nextLoserMatchId);
    }
    matches.push(match);
  }

  return { matchId, nextLoserMatchId };
}

function generateLowerRound(
  matches: Match[],
  participants: number,
  matchId: number,
  round: number,
  gender: GenderPlural,
) {
  let finalMatch = false;
  let nextWinnerMatchId;
  if (participants === 2 && round % 2 === 0) {
    finalMatch = true;
  } else {
    nextWinnerMatchId = matchId + participants / 2;
  }

  for (let i = 0; i < participants / 2; i++) {
    const match = {
      id: matchId++,
      round: round,
      grid: "lower",
      status: "pending",
      gender: gender,
    } as Match;
    if (!finalMatch) {
      match.player1 = null;
      match.player2 = null;
      match.winnerGoesId = Math.trunc(nextWinnerMatchId!);
      if (round % 2 === 0) {
        nextWinnerMatchId! += 0.5;
      } else {
        nextWinnerMatchId! += 1;
      }
    } else {
      match.isGridFinal = true;
      match.winnerGoesId = 1000; // id гранд финала
    }

    matches.push(match);
  }

  return matchId;
}

export function findMatchById(
  matches: Matches,
  gender: GenderPlural,
  id: number,
): Match {
  return matches[gender]!.find((match: Match) => match.id == id)!;
}

export function resolveMatch(
  matches: Matches,
  matchId: number,
  gender: GenderPlural,
  winnerId: number,
  loserId: number,
) {
  const match = matches[gender]!.find(
    (match: Match) => match.id === matchId,
  )! as Match;

  // стоит добавить обработку ошибок, в частности проверка статуса, но это потом
  match.status = "finished";
  match.winner =
    winnerId == match.player1!.id ? match.player1! : match.player2!;
  match.loser = loserId == match.player1!.id ? match.player1! : match.player2!;

  // если это был гранд финал, то получаем победителя и завершаем функцию
  if (match.id === 1000) {
    localStorage.setItem("matches", JSON.stringify(matches));
    return;
  }

  // переместим победителя в нужный матч
  const winnerGoesMatch = findMatchById(
    matches,
    match.gender,
    match.winnerGoesId!,
  );
  if (!winnerGoesMatch.player1) {
    winnerGoesMatch.player1 =
      winnerId == match.player1!.id ? match.player1 : match.player2;
  } else {
    winnerGoesMatch.player2 =
      winnerId == match.player1!.id ? match.player1 : match.player2;
    winnerGoesMatch.status = "readyToPlay";
  }
  // и проигравшего, если он в верхней сетке
  if (match.grid === "upper") {
    const loserGoesMatch = findMatchById(
      matches,
      match.gender,
      match.loserGoesId!,
    );
    if (!loserGoesMatch.player1) {
      loserGoesMatch.player1 =
        loserId == match.player1!.id ? match.player1 : match.player2;
    } else {
      loserGoesMatch.player2 =
        loserId == match.player1!.id ? match.player1 : match.player2;
      loserGoesMatch.status = "readyToPlay";
    }
  }

  localStorage.setItem("matches", JSON.stringify(matches));

  return matches;
}

export function playByeMatches(matches: Matches) {
  const allMatches: Match[] = [
    ...(matches.boys ?? []),
    ...(matches.girls ?? []),
  ];
  allMatches.forEach((match) => {
    if (
      match.status === "readyToPlay" &&
      (match.player1!.isBye === true || match.player2!.isBye === true)
    ) {
      if (match.player1!.isBye === true) {
        resolveMatch(
          matches,
          match.id,
          match.gender,
          match.player2!.id,
          match.player1!.id,
        );
      } else {
        resolveMatch(
          matches,
          match.id,
          match.gender,
          match.player1!.id,
          match.player2!.id,
        );
      }
    }
  });
}

function getStrandings(matches: Matches, gender: GenderPlural) {
  // Сперва фильтруем только по нижней сетке
  const lowerMatches: Match[] = matches[gender]!.filter(
    (match: Match) => match.grid === "lower",
  );
  // определим максимальный номер раунда нижней сетки
  const maxRound = lowerMatches.reduce((maxRound, match) => {
    return match.round > maxRound ? match.round : maxRound;
  }, 1);
  // и посчитаем, сколько всего было участников
  const namesCount = JSON.parse(localStorage.getItem("names") ?? "null").filter(
    (name: Name) => name.gender === gender + "s",
  ).length;

  // сгруппируем: номер раунда -> массив проигравших
  const matchesByRound = new Map<number, Name[]>();
  lowerMatches.forEach((match) => {
    if (match.status === "finished" && match.loser && !match.loser.isBye) {
      if (matchesByRound.has(match.round)) {
        matchesByRound.get(match.round)!.push(match.loser);
      } else {
        matchesByRound.set(match.round, [match.loser]);
      }
    }
  });

  // теперь соберем это в вид: место -> имя
  const standings: Record<number | string, string[]> = {};
  // Начнем с гранд финала - там определяются 1 и 2 место
  if (
    matches[gender]!.find((match) => match.id === 1000)!.status === "finished"
  ) {
    standings[1] = [
      matches[gender]!.find((match) => match.id === 1000)!.winner!.name,
    ];
    standings[2] = [
      matches[gender]!.find((match) => match.id === 1000)!.loser!.name,
    ];
  } else {
    standings[1] = ["—"];
    standings[2] = ["—"];
  }

  // Остальные места определим по проигравшим в нижней сетке
  let startPlace = 3;
  // Проходим по раундам начиная с конца
  for (let i = maxRound; i >= 1; i--) {
    const step = Math.floor((maxRound - i) / 2) + 1; // количество игроков в раунде нижней сетки умножается на 1 потом на 2 потом на 1 и так далее
    const endPlace =
      startPlace + step - 1 > namesCount ? namesCount : startPlace + step - 1; // посчитаем, до какого места рпоигравшие его делят
    const key =
      endPlace > startPlace ? `${startPlace}-${endPlace}` : `${startPlace}`; // отформатируем ключ для отрисовки
    // теперь создадим ключ, если еще его нет, и заполним именами
    if (matchesByRound.has(i)) {
      matchesByRound.get(i)!.forEach(() => {
        standings[key] = matchesByRound.get(i)!.map((match) => match.name);
      });
    }
    // если ключ так и не создали - заполним его TBD массивом
    if (!matchesByRound.has(i)) {
      standings[key] = new Array(step).fill("—");
    }
    // также проверим, что если ключ создан - он нужной длины, и если нет - дополним
    while (standings[key]!.length < endPlace - startPlace + 1) {
      standings[key]!.push("—");
    }
    // стоит завершить цикл, если мы уже добрались до количества участников
    if (endPlace === namesCount) {
      break;
    }
    startPlace += step;
  }
  return standings;
}

function isGrandFinalFinished(gender: GenderPlural) {
  const matches = JSON.parse(localStorage.getItem("matches") ?? "null");
  return (
    matches[gender].find((match: Match) => match.id === 1000).status ===
    "finished"
  );
}

// рендер

function renderRoundsNumbers(
  matches: Matches,
  querySelector: string,
  gender: GenderPlural,
  grid: Grid,
) {
  const rounds = matches[gender]!.filter((match) => match.grid === grid).reduce(
    (maxRound, match) => {
      return match.round > maxRound ? match.round : maxRound;
    },
    1,
  );
  const node = document.querySelector(querySelector);
  node!.innerHTML = "";
  for (let i = 1; i <= rounds - 1; i++) {
    const header = document.createElement("div");
    header.classList.add("bracket-headers__col");
    header.textContent = `Раунд ${i}`;
    node!.appendChild(header);
  }
  const header = document.createElement("div");
  header.classList.add("bracket-headers__col");
  header.textContent = "Финал сетки";
  node!.appendChild(header);
}

function renderMatch(match: Match) {
  if (match.id === 1000) {
    renderGrandFinal(match);
    return;
  }

  // найти турнир и сетку
  let matchNodeQuery = "#";
  matchNodeQuery += match.gender;
  matchNodeQuery += "-";
  matchNodeQuery += match.grid === "upper" ? "winners" : "losers";
  matchNodeQuery += "-bracket .bracket";

  const matchNode = document.querySelector(matchNodeQuery);

  const bracketRound =
    (matchNode!.querySelector(
      `[data-round="${match.round}"]`,
    ) as HTMLElement) || document.createElement("div");
  bracketRound.classList.add("bracket__round");
  bracketRound.dataset.round = String(match.round);

  const bracketMatch = document.createElement("div");
  bracketMatch.classList.add("bracket__match");

  // соберём айдишник матча
  let dataMatchId = match.gender.slice(0, 1); // первая буква - пол
  dataMatchId += match.grid === "upper" ? "wm" : "lm"; // вторая буква - сетка
  dataMatchId += match.id;
  bracketMatch.dataset.match_id = dataMatchId;

  const bracketSlot1 = document.createElement("div");
  bracketSlot1.classList.add("bracket__slot");
  bracketSlot1.textContent = match.player1 ? match.player1.name : "TBD";
  if (!match.player1) {
    bracketSlot1.classList.add("bracket__slot--pending");
  } else if (match.player1.isBye) {
    bracketSlot1.classList.add("bracket__slot--bye");
  } else if (match.winner && match.player1.id === match.winner.id) {
    bracketSlot1.classList.add("bracket__slot--winner");
  }
  const bracketSlot2 = document.createElement("div");
  bracketSlot2.classList.add("bracket__slot");
  bracketSlot2.textContent = match.player2 ? match.player2.name : "TBD";
  if (!match.player2) {
    bracketSlot2.classList.add("bracket__slot--pending");
  } else if (match.player2.isBye) {
    bracketSlot2.classList.add("bracket__slot--bye");
  } else if (match.winner && match.player2.id === match.winner.id) {
    bracketSlot2.classList.add("bracket__slot--winner");
  }

  bracketMatch.appendChild(bracketSlot1);
  bracketMatch.appendChild(bracketSlot2);
  bracketRound.appendChild(bracketMatch);
  matchNode!.appendChild(bracketRound);
}

function renderGrandFinal(match: Match) {
  const grandFinalNode =
    match.gender === "boys"
      ? document.querySelector("#boys-grand-final .bracket__match")
      : document.querySelector("#girls-grand-final .bracket__match");
  const player1Node = document.createElement("div");
  player1Node.classList.add("bracket__slot");
  player1Node.textContent = match.player1
    ? match.player1.name
    : "Победитель В.С.";
  if (!match.player1) {
    player1Node.classList.add("bracket__slot--pending");
  } else if (match.player1.isBye) {
    player1Node.classList.add("bracket__slot--bye");
  } else if (match.winner && match.player1.id === match.winner.id) {
    player1Node.classList.add("bracket__slot--winner");
  }
  const player2Node = document.createElement("div");
  player2Node.classList.add("bracket__slot");
  player2Node.textContent = match.player2
    ? match.player2.name
    : "Победитель Н.С.";
  if (!match.player2) {
    player2Node.classList.add("bracket__slot--pending");
  } else if (match.player2.isBye) {
    player2Node.classList.add("bracket__slot--bye");
  } else if (match.winner && match.player2.id === match.winner.id) {
    player2Node.classList.add("bracket__slot--winner");
  }
  grandFinalNode!.appendChild(player1Node);
  grandFinalNode!.appendChild(player2Node);
}

function setBracketHeight(matches: Match[], querySelector: string, grid: Grid) {
  const rounds = matches.filter(
    (match) => match.grid === grid && match.round === 1,
  ).length;
  const bracketNode = document.querySelector<HTMLElement>(querySelector);
  if (!bracketNode) {
    return;
  }
  bracketNode.style.setProperty("--bracket-height", `${86 * rounds}px`);
}

function renderPage() {
  const matches = JSON.parse(localStorage.getItem("matches") ?? "null");
  if (!matches) {
    return;
  }
  renderRoundsNumbers(
    matches,
    "#boys-winners-bracket .bracket-headers",
    "boys",
    "upper",
  );
  renderRoundsNumbers(
    matches,
    "#boys-losers-bracket .bracket-headers",
    "boys",
    "lower",
  );
  renderRoundsNumbers(
    matches,
    "#girls-winners-bracket .bracket-headers",
    "girls",
    "upper",
  );
  renderRoundsNumbers(
    matches,
    "#girls-losers-bracket .bracket-headers",
    "girls",
    "lower",
  );

  setBracketHeight(matches.boys, "#boys-winners-bracket .bracket", "upper");
  setBracketHeight(matches.girls, "#girls-winners-bracket .bracket", "upper");
  setBracketHeight(matches.boys, "#boys-losers-bracket .bracket", "lower");
  setBracketHeight(matches.girls, "#girls-losers-bracket .bracket", "lower");

  matches.boys.forEach((match: Match) => {
    renderMatch(match);
  });
  matches.girls.forEach((match: Match) => {
    renderMatch(match);
  });
}

function renderStrandings(matches: Matches) {
  const boysPlacesNode = document.getElementById("boys-standings-group");
  const girlsPlacesNode = document.getElementById("girls-standings-group");
  boysPlacesNode!.addEventListener("click", function () {
    boysPlacesNode!.classList.toggle("standings-group--open");
  });
  girlsPlacesNode!.addEventListener("click", function () {
    girlsPlacesNode!.classList.toggle("standings-group--open");
  });
  if (isGrandFinalFinished("boys")) {
    boysPlacesNode!.classList.add("standings-group--always-open");
  }
  if (isGrandFinalFinished("girls")) {
    girlsPlacesNode!.classList.add("standings-group--always-open");
  }

  const boysStandings = getStrandings(matches, "boys");
  const girlsStandings = getStrandings(matches, "girls");

  const names = JSON.parse(localStorage.getItem("names") ?? "null");

  const boysStandingsNode = document.querySelector("#boys-standings");
  const girlsStandingsNode = document.querySelector("#girls-standings");

  // отрисуем мальчиков
  for (const [key, value] of Object.entries(boysStandings)) {
    const divEntry = document.createElement("div");
    divEntry.classList.add("standings__entry");
    boysStandingsNode!.appendChild(divEntry);
    const spanPlace = document.createElement("span");
    spanPlace.classList.add("standings__place");
    spanPlace.textContent = key;
    const placeClass =
      placeClasses[key as unknown as keyof typeof placeClasses];
    if (placeClass) {
      spanPlace.classList.add(placeClass);
    }
    divEntry.appendChild(spanPlace);
    const divNames = document.createElement("div");
    divNames.classList.add("standings__names");
    divEntry.appendChild(divNames);
    value.forEach((name) => {
      const spanName = document.createElement("span");
      spanName.classList.add("standings__name");
      spanName.textContent = name;
      if (name === "—") {
        spanName.classList.add("standings__name--pending");
      }
      divNames.appendChild(spanName);
    });
  }

  // отрисуем девочек
  for (const [key, value] of Object.entries(girlsStandings)) {
    const divEntry = document.createElement("div");
    divEntry.classList.add("standings__entry");
    girlsStandingsNode!.appendChild(divEntry);
    const spanPlace = document.createElement("span");
    spanPlace.classList.add("standings__place");
    spanPlace.textContent = key;
    const placeClass =
      placeClasses[key as unknown as keyof typeof placeClasses];
    if (placeClass) {
      spanPlace.classList.add(placeClass);
    }
    divEntry.appendChild(spanPlace);
    const divNames = document.createElement("div");
    divNames.classList.add("standings__names");
    divEntry.appendChild(divNames);
    value.forEach((name) => {
      const spanName = document.createElement("span");
      spanName.classList.add("standings__name");
      spanName.textContent = name;
      if (name === "—") {
        spanName.classList.add("standings__name--pending");
      }
      divNames.appendChild(spanName);
    });
  }
}

// непосредствено вызов функции рендера
if (document.querySelector("#boys-tournament")) {
  renderPage();
  renderStrandings(JSON.parse(localStorage.getItem("matches") ?? "null"));
}
