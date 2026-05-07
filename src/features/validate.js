/**
 * Функция пока что работает только для 8 и 16 участников
 */
function validate(participants, matches) {
  // валидация на 8 участников
  const VALIDATION_8 = [
    { matchId: 0, winnerGoesId: 4, loserGoesId: 100 },
    { matchId: 1, winnerGoesId: 4, loserGoesId: 100 },
    { matchId: 2, winnerGoesId: 5, loserGoesId: 101 },
    { matchId: 3, winnerGoesId: 5, loserGoesId: 101 },
    { matchId: 4, winnerGoesId: 6, loserGoesId: 103 },
    { matchId: 5, winnerGoesId: 6, loserGoesId: 102 },
    { matchId: 6, winnerGoesId: 1000, loserGoesId: 105 },
    { matchId: 100, winnerGoesId: 102, loserGoesId: undefined },
    { matchId: 101, winnerGoesId: 103, loserGoesId: undefined },
    { matchId: 102, winnerGoesId: 104, loserGoesId: undefined },
    { matchId: 103, winnerGoesId: 104, loserGoesId: undefined },
    { matchId: 104, winnerGoesId: 105, loserGoesId: undefined },
    { matchId: 105, winnerGoesId: 1000, loserGoesId: undefined },
    { matchId: 1000, winnerGoesId: undefined, loserGoesId: undefined },
  ];

  // валидация на 16 участников
  const VALIDATION_16 = [
    { matchId: 0, winnerGoesId: 8, loserGoesId: 100 },
    { matchId: 1, winnerGoesId: 8, loserGoesId: 100 },
    { matchId: 2, winnerGoesId: 9, loserGoesId: 101 },
    { matchId: 3, winnerGoesId: 9, loserGoesId: 101 },
    { matchId: 4, winnerGoesId: 10, loserGoesId: 102 },
    { matchId: 5, winnerGoesId: 10, loserGoesId: 102 },
    { matchId: 6, winnerGoesId: 11, loserGoesId: 103 },
    { matchId: 7, winnerGoesId: 11, loserGoesId: 103 },
    { matchId: 8, winnerGoesId: 12, loserGoesId: 107 },
    { matchId: 9, winnerGoesId: 12, loserGoesId: 106 },
    { matchId: 10, winnerGoesId: 13, loserGoesId: 105 },
    { matchId: 11, winnerGoesId: 13, loserGoesId: 104 },
    { matchId: 12, winnerGoesId: 14, loserGoesId: 110 },
    { matchId: 13, winnerGoesId: 14, loserGoesId: 111 },
    { matchId: 14, winnerGoesId: 1000, loserGoesId: 113 },
    { matchId: 100, winnerGoesId: 104, loserGoesId: undefined },
    { matchId: 101, winnerGoesId: 105, loserGoesId: undefined },
    { matchId: 102, winnerGoesId: 106, loserGoesId: undefined },
    { matchId: 103, winnerGoesId: 107, loserGoesId: undefined },
    { matchId: 104, winnerGoesId: 108, loserGoesId: undefined },
    { matchId: 105, winnerGoesId: 108, loserGoesId: undefined },
    { matchId: 106, winnerGoesId: 109, loserGoesId: undefined },
    { matchId: 107, winnerGoesId: 109, loserGoesId: undefined },
    { matchId: 108, winnerGoesId: 110, loserGoesId: undefined },
    { matchId: 109, winnerGoesId: 111, loserGoesId: undefined },
    { matchId: 110, winnerGoesId: 112, loserGoesId: undefined },
    { matchId: 111, winnerGoesId: 112, loserGoesId: undefined },
    { matchId: 112, winnerGoesId: 113, loserGoesId: undefined },
    { matchId: 113, winnerGoesId: 1000, loserGoesId: undefined },
    { matchId: 1000, winnerGoesId: undefined, loserGoesId: undefined },
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

  for (let i = 0; i < matches.length; i++) {
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
