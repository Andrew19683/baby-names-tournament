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

export function generateMatches(names) {
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
    ));
    participatsForRound /= 2;
    round++;
  }

  // создаём матчи нижней сетки
  matchId = 100; // начинаем с id 100 для нижней сетки
  round = 1; // раунды нижней сетки считаем заново
  participatsForRound = names.length / 2; // в нижней сетке изначально половина участников
  while (participatsForRound >= 2) {
    matchId = generateLowerRound(matches, participatsForRound, matchId, round);
    if (round % 2 === 0) {
      participatsForRound /= 2;
    }
    round++;
  }

  // и финальный матч
  matches.push({ id: 1000, round: 1, player1: null, player2: null });

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

function generateLowerRound(matches, participants, matchId, round) {
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

// let names =
//   JSON.parse(`[{"name":"Алексей","gender":"m","round":0,"grid":"upper"},{"name":"Борис","gender":"m","round":0,"grid":"upper"},{"name":"Владимир","gender":"m","round":0,"grid":"upper"},{"name":"Григорий","gender":"m","round":0,"grid":"upper"},{"name":"Дмитрий","gender":"m","round":0,"grid":"upper"},{"name":"Евгений","gender":"m","round":0,"grid":"upper"},{"name":"Жан","gender":"m","round":0,"grid":"upper"},{"name":"Зак","gender":"m","round":0,"grid":"upper"},{"name":"Илья","gender":"m","round":0,"grid":"upper"},{"name":"Кирилл","gender":"m","round":0,"grid":"upper"},{"name":"Леонид","gender":"m","round":0,"grid":"upper"}]
// `); // пока let, потом будем работать с localStorage и туда всё регулярно сохранять
// names = names.slice(0, 7); // для теста
// startTournament();
// generateMatches();
