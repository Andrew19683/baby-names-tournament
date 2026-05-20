import validate from "./validate.js";

export function startTournament(names) {
  // Вычисляем следующую степень двойки, которая больше или равна длине массива
  // За счёт этого определим вид турнира
  const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(names.length)));

  // Перемешиваем массив имен с помощью алгоритма Фишера-Йетса
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [names[i], names[j]] = [names[j], names[i]];
  }
  // Добавляем "пустых" участников в конец массива через одного, пока число участников не станет степенью двойки
  while (names.length < nextPowerOfTwo) {
    const leftSlots = nextPowerOfTwo - names.length;
    names.splice(nextPowerOfTwo - 2 * leftSlots + 1, 0, {
      name: "Пусто",
      isBye: true,
    });
  }

  // Проставим каждому участнику его id
  names.forEach((name, index) => {
    name.id = index;
  });
  //console.log(names);
  return names;
}

export function generateMatches(names, gender) {
  // протестировал для 8 и 16 участников. Понятия не имею, как оно будет на других степенях двойки, но выглядит корректно
  const matches = []; // сюда закидываем все созданные матчи
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
  matches,
  participants,
  matchId,
  round,
  nextLoserMatchId,
  names,
  gender,
) {
  // console.log(nextLoserMatchId);
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
    };
    if (round === 1) {
      match.player1 = names[i];
      match.player2 = names[participants - 1 - i];
      match.status = "readyToPlay";
    } else {
      match.player1 = null;
      match.player2 = null;
      match.status = "pending";
    }
    if (!finalMatch) {
      match.winnerGoesId = Math.trunc(nextWinnerMatchId);
      nextWinnerMatchId += 0.5;
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

  // console.log(nextLoserMatchId);
  return { matchId, nextLoserMatchId };
}

function generateLowerRound(matches, participants, matchId, round, gender) {
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
    };
    if (!finalMatch) {
      match.player1 = null;
      match.player2 = null;
      match.winnerGoesId = Math.trunc(nextWinnerMatchId);
      if (round % 2 === 0) {
        nextWinnerMatchId += 0.5;
      } else {
        nextWinnerMatchId += 1;
      }
    } else {
      match.isGridFinal = true;
      match.winnerGoesId = 1000; // id гранд финала
    }

    matches.push(match);
  }

  return matchId;
}

export function findMatchById(matches, gender, id) {
  const genderName = gender === "m" ? "boys" : "girls";
  return matches[genderName].find((match) => match.id == id);
}

export function resolveMatch(matches, matchId, gender, winnerId, loserId) {
  const genderName = gender === "m" ? "boys" : "girls";
  const match = matches[genderName].find((match) => match.id === matchId);

  // стоит добавить обработку ошибок, в частности проверка статуса, но это потом
  match.status = "finished";
  match.winner = winnerId == match.player1.id ? match.player1 : match.player2;
  match.loser = loserId == match.player1.id ? match.player1 : match.player2;

  // если это был гранд финал, то получаем победителя и завершаем функцию
  if (match.id === 1000) {
    console.log(
      `Победа в турнире имён за ${winnerId == match.player1.id ? match.player1.name : match.player2.name}! Поздравляем!!!`,
    );
    localStorage.setItem("matches", JSON.stringify(matches));
    return;
  }

  // переместим победителя в нужный матч
  const winnerGoesMatch = findMatchById(
    matches,
    match.gender,
    match.winnerGoesId,
  );
  if (!winnerGoesMatch.player1) {
    winnerGoesMatch.player1 =
      winnerId == match.player1.id ? match.player1 : match.player2;
  } else {
    winnerGoesMatch.player2 =
      winnerId == match.player1.id ? match.player1 : match.player2;
    winnerGoesMatch.status = "readyToPlay";
  }
  // и проигравшего, если он в верхней сетке
  if (match.grid === "upper") {
    const loserGoesMatch = findMatchById(
      matches,
      match.gender,
      match.loserGoesId,
    );
    if (!loserGoesMatch.player1) {
      loserGoesMatch.player1 =
        loserId == match.player1.id ? match.player1 : match.player2;
    } else {
      loserGoesMatch.player2 =
        loserId == match.player1.id ? match.player1 : match.player2;
      loserGoesMatch.status = "readyToPlay";
    }
  }

  localStorage.setItem("matches", JSON.stringify(matches));

  return matches;
}

export function playByeMatches(matches) {
  console.log(matches);
  const allMatches = [...matches.boys, ...matches.girls];
  allMatches.forEach((match) => {
    if (
      match.status === "readyToPlay" &&
      (match.player1.isBye === true || match.player2.isBye === true)
    ) {
      if (match.player1.isBye === true) {
        resolveMatch(
          matches,
          match.id,
          match.gender,
          match.player2.id,
          match.player1.id,
        );
      } else {
        resolveMatch(
          matches,
          match.id,
          match.gender,
          match.player1.id,
          match.player2.id,
        );
      }
    }
  });
}

// рендер

function renderRoundsNumbers(matches, querySelector, gender, grid) {
  const rounds = matches[gender]
    .filter((match) => match.grid === grid)
    .reduce((maxRound, match) => {
      return match.round > maxRound ? match.round : maxRound;
    }, 1);
  const node = document.querySelector(querySelector);
  node.innerHTML = "";
  for (let i = 1; i <= rounds - 1; i++) {
    const header = document.createElement("div");
    header.classList.add("bracket-headers__col");
    header.textContent = `Раунд ${i}`;
    node.appendChild(header);
  }
  const header = document.createElement("div");
  header.classList.add("bracket-headers__col");
  header.textContent = "Финал сетки";
  node.appendChild(header);
}

function renderMatch(match) {
  if (match.id === 1000) {
    renderGrandFinal(match);
    return;
  }

  // найти турнир и сетку
  let matchNodeQuery = "#";
  matchNodeQuery += match.gender === "m" ? "boys" : "girls";
  matchNodeQuery += "-";
  matchNodeQuery += match.grid === "upper" ? "winners" : "losers";
  matchNodeQuery += "-bracket .bracket";

  const matchNode = document.querySelector(matchNodeQuery);

  const bracketRound =
    matchNode.querySelector(`[data-round="${match.round}"]`) ||
    document.createElement("div");
  bracketRound.classList.add("bracket__round");
  bracketRound.dataset.round = match.round;

  const bracketMatch = document.createElement("div");
  bracketMatch.classList.add("bracket__match");

  // соберём айдишник матча
  let dataMatchId = match.gender === "m" ? "b" : "g"; // первая буква - пол
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
  matchNode.appendChild(bracketRound);
}

function renderGrandFinal(match) {
  const grandFinalNode =
    match.gender === "m"
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
  grandFinalNode.appendChild(player1Node);
  grandFinalNode.appendChild(player2Node);
}

function setBracketHeight(matches, querySelector, gender, grid) {
  const rounds = matches.filter(
    (match) => match.grid === grid && match.round === 1,
  ).length;
  const bracketNode = document.querySelector(querySelector);
  bracketNode.style.setProperty("--bracket-height", `${86 * rounds}px`);
}

function renderPage() {
  const matches = JSON.parse(localStorage.getItem("matches"));
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

  setBracketHeight(
    matches.boys,
    "#boys-winners-bracket .bracket",
    "m",
    "upper",
  );
  setBracketHeight(
    matches.girls,
    "#girls-winners-bracket .bracket",
    "f",
    "upper",
  );
  setBracketHeight(matches.boys, "#boys-losers-bracket .bracket", "m", "lower");
  setBracketHeight(
    matches.girls,
    "#girls-losers-bracket .bracket",
    "f",
    "lower",
  );

  matches.boys.forEach((match) => {
    renderMatch(match);
  });
  matches.girls.forEach((match) => {
    renderMatch(match);
  });
}

if (document.querySelector("#boys-tournament")) {
  renderPage();
}
// let names =
//   JSON.parse(`[{"name":"Алексей","gender":"m","round":0,"grid":"upper"},{"name":"Борис","gender":"m","round":0,"grid":"upper"},{"name":"Владимир","gender":"m","round":0,"grid":"upper"},{"name":"Григорий","gender":"m","round":0,"grid":"upper"},{"name":"Дмитрий","gender":"m","round":0,"grid":"upper"},{"name":"Евгений","gender":"m","round":0,"grid":"upper"},{"name":"Жан","gender":"m","round":0,"grid":"upper"},{"name":"Зак","gender":"m","round":0,"grid":"upper"},{"name":"Илья","gender":"m","round":0,"grid":"upper"},{"name":"Кирилл","gender":"m","round":0,"grid":"upper"},{"name":"Леонид","gender":"m","round":0,"grid":"upper"}]
// `); // пока let, потом будем работать с localStorage и туда всё регулярно сохранять
// names = names.slice(0, 7); // для теста
// startTournament();
// generateMatches();
