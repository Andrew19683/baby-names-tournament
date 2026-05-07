/**
 * Функция пока что работает только для 8 и 16 участников
 */
function validate(participants, matches) {
  // валидация на 8 участников
  const VALIDATION_8 = [
    { matchId: 0, winnerGoesId: 4, loserGoesId: 100, round: 1 },
    { matchId: 1, winnerGoesId: 4, loserGoesId: 100, round: 1 },
    { matchId: 2, winnerGoesId: 5, loserGoesId: 101, round: 1 },
    { matchId: 3, winnerGoesId: 5, loserGoesId: 101, round: 1 },
    { matchId: 4, winnerGoesId: 6, loserGoesId: 103, round: 2 },
    { matchId: 5, winnerGoesId: 6, loserGoesId: 102, round: 2 },
    { matchId: 6, winnerGoesId: 1000, loserGoesId: 105, round: 3 },
    { matchId: 100, winnerGoesId: 102, loserGoesId: undefined, round: 1 },
    { matchId: 101, winnerGoesId: 103, loserGoesId: undefined, round: 1 },
    { matchId: 102, winnerGoesId: 104, loserGoesId: undefined, round: 2 },
    { matchId: 103, winnerGoesId: 104, loserGoesId: undefined, round: 2 },
    { matchId: 104, winnerGoesId: 105, loserGoesId: undefined, round: 3 },
    { matchId: 105, winnerGoesId: 1000, loserGoesId: undefined, round: 4 },
    {
      matchId: 1000,
      winnerGoesId: undefined,
      loserGoesId: undefined,
      round: 1,
    },
  ];

  // валидация на 16 участников
  const VALIDATION_16 = [
    { matchId: 0, winnerGoesId: 8, loserGoesId: 100, round: 1 },
    { matchId: 1, winnerGoesId: 8, loserGoesId: 100, round: 1 },
    { matchId: 2, winnerGoesId: 9, loserGoesId: 101, round: 1 },
    { matchId: 3, winnerGoesId: 9, loserGoesId: 101, round: 1 },
    { matchId: 4, winnerGoesId: 10, loserGoesId: 102, round: 1 },
    { matchId: 5, winnerGoesId: 10, loserGoesId: 102, round: 1 },
    { matchId: 6, winnerGoesId: 11, loserGoesId: 103, round: 1 },
    { matchId: 7, winnerGoesId: 11, loserGoesId: 103, round: 1 },
    { matchId: 8, winnerGoesId: 12, loserGoesId: 107, round: 2 },
    { matchId: 9, winnerGoesId: 12, loserGoesId: 106, round: 2 },
    { matchId: 10, winnerGoesId: 13, loserGoesId: 105, round: 2 },
    { matchId: 11, winnerGoesId: 13, loserGoesId: 104, round: 2 },
    { matchId: 12, winnerGoesId: 14, loserGoesId: 110, round: 3 },
    { matchId: 13, winnerGoesId: 14, loserGoesId: 111, round: 3 },
    { matchId: 14, winnerGoesId: 1000, loserGoesId: 113, round: 4 },
    { matchId: 100, winnerGoesId: 104, loserGoesId: undefined, round: 1 },
    { matchId: 101, winnerGoesId: 105, loserGoesId: undefined, round: 1 },
    { matchId: 102, winnerGoesId: 106, loserGoesId: undefined, round: 1 },
    { matchId: 103, winnerGoesId: 107, loserGoesId: undefined, round: 1 },
    { matchId: 104, winnerGoesId: 108, loserGoesId: undefined, round: 2 },
    { matchId: 105, winnerGoesId: 108, loserGoesId: undefined, round: 2 },
    { matchId: 106, winnerGoesId: 109, loserGoesId: undefined, round: 2 },
    { matchId: 107, winnerGoesId: 109, loserGoesId: undefined, round: 2 },
    { matchId: 108, winnerGoesId: 110, loserGoesId: undefined, round: 3 },
    { matchId: 109, winnerGoesId: 111, loserGoesId: undefined, round: 3 },
    { matchId: 110, winnerGoesId: 112, loserGoesId: undefined, round: 4 },
    { matchId: 111, winnerGoesId: 112, loserGoesId: undefined, round: 4 },
    { matchId: 112, winnerGoesId: 113, loserGoesId: undefined, round: 5 },
    { matchId: 113, winnerGoesId: 1000, loserGoesId: undefined, round: 6 },
    {
      matchId: 1000,
      winnerGoesId: undefined,
      loserGoesId: undefined,
      round: 1,
    },
  ];

  let validation;
  if (participants === 8) {
    validation = VALIDATION_8;
  } else if (participants === 16) {
    validation = VALIDATION_16;
  } else {
    console.log("Валидация пока что работает только для 8 и 16 участников");
    return;
  }

  for (let i = 0; i < validation.length; i++) {
    matches[i].id === validation[i].matchId
      ? console.log(`id ${validation[i].matchId} ✅`)
      : console.log(`id ${validation[i].matchId} ❌:
        expected ${validation[i].matchId}, got ${matches[i].id} `);
    matches[i].winnerGoesId === validation[i].winnerGoesId
      ? console.log(`winnerGoesId ${validation[i].winnerGoesId} ✅`)
      : console.log(`winnerGoesId ${validation[i].winnerGoesId} ❌:
        expected ${validation[i].winnerGoesId}, got ${matches[i].winnerGoesId}`);
    matches[i].loserGoesId === validation[i].loserGoesId
      ? console.log(`loserGoesId ${validation[i].loserGoesId} ✅`)
      : console.log(`loserGoesId ${validation[i].loserGoesId} ❌:
        expected ${validation[i].loserGoesId}, got ${matches[i].loserGoesId}`);
    console.log("-------------");
  }
}

export default validate;
