function startTournament() {
  // Вычисляем следующую степень двойки, которая больше или равна длине массива
  // За счёт этого определим вид турнира
  const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(names.length)));

  // Перемешиваем массив имен с помощью алгоритма Фишера-Йетса
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [names[i], names[j]] = [names[j], names[i]];
  }
  // Добавляем "пустых" участников до длины массива степени двойки
  while (names.length < nextPowerOfTwo) {
    names.push({ name: "Пусто", isBye: true });
  }

  // Проставим каждому участнику его id
  names.forEach((name, index) => {
    name.id = index;
  });
  //console.log(names);
  return names;
}

function generateMatches() {
  const matches = []; // сюда закидываем все созданные матчи
  let matchId = 0; // глобальный счетчик матчей верхней сетки
  let round = 1; // текущий раунд
  let loserMatchId = 100; // счетчик для матчей нижней сетки, начинаем с 100, чтобы не пересекаться с верхней сеткой

  let participatsForRound = names.length; // количество участников для текущего раунда

  while (participatsForRound >= 2) {
    ({ matchId, nextLoserMatchId: loserMatchId } = generateUpperRound(
      matches,
      participatsForRound,
      matchId,
      round,
      loserMatchId,
    ));
    participatsForRound /= 2;
    round++;
  }
  console.log(matches);
}

function generateUpperRound(
  matches,
  participants,
  matchId,
  round,
  nextLoserMatchId,
) {
  console.log(nextLoserMatchId);
  let finalMatch = false;
  let nextWinnerMatchId;
  if (participants === 2) {
    finalMatch = true;
  } else {
    nextWinnerMatchId = matchId + participants / 2;
  }

  for (let i = 0; i < participants / 2; i++) {
    const match = {
      id: matchId++,
      round: round,
      grid: "upper",
      status: "pending",
    };
    if (round === 1) {
      match.player1 = names[i];
      match.player2 = names[participants - 1 - i];
    } else {
      match.player1 = null;
      match.player2 = null;
    }
    if (!finalMatch) {
      match.winnerGoesId = Math.trunc(nextWinnerMatchId);
      nextWinnerMatchId += 0.5;
      if (round % 2 === 1) {
        match.loserGoesId = Math.trunc(nextLoserMatchId);
        nextLoserMatchId += 0.5;
      } else {
        match.loserGoesId = Math.trunc(
          nextLoserMatchId + participants / 4 - i * 2,
        );
        nextLoserMatchId += 1;
      }
    } else {
      match.isGridFinal = true;
    }
    matches.push(match);
  }
  console.log(nextLoserMatchId);
  return { matchId, nextLoserMatchId };
}

let names =
  JSON.parse(`[{"name":"Алексей","gender":"m","round":0,"grid":"upper"},{"name":"Борис","gender":"m","round":0,"grid":"upper"},{"name":"Владимир","gender":"m","round":0,"grid":"upper"},{"name":"Григорий","gender":"m","round":0,"grid":"upper"},{"name":"Дмитрий","gender":"m","round":0,"grid":"upper"},{"name":"Евгений","gender":"m","round":0,"grid":"upper"},{"name":"Жан","gender":"m","round":0,"grid":"upper"},{"name":"Зак","gender":"m","round":0,"grid":"upper"},{"name":"Илья","gender":"m","round":0,"grid":"upper"},{"name":"Кирилл","gender":"m","round":0,"grid":"upper"},{"name":"Леонид","gender":"m","round":0,"grid":"upper"}]
`); // пока let, потом будем работать с localStorage и туда всё регулярно сохранять
names = names.slice(0, 7); // для теста
startTournament();
generateMatches();
