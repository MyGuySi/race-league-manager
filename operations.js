const constants = require('./constants');

function racePosition(rounds) {
  return rounds.map((round, index) => {
    return round.results.map((result) => {
      const { id, name, finishPosition, lapsCompleted } = result;

      // Check 75% race distance was completed
      if (lapsCompleted < Math.floor(round.totalLaps * 0.75)) {
        return {
          id: id,
          name: name,
          points: 0,
          reason: `Round ${index + 1} - Finished P${finishPosition + 1} (Insufficient race distance)`
        };
      }

      const points = constants.positionPoints[finishPosition + 1] || 0;

      return {
        id: id,
        name: name,
        points: points,
        reason: `Round ${index + 1} - Finished P${finishPosition + 1}`
      };
    });
  }).flat();
}

function polePosition(rounds) {
  return rounds.map((round, number) => {
    const sorted = round.results.sort((a, b) => {
      if (a.startPosition < b.startPosition) return -1;
      if (a.startPosition > b.startPosition) return 1;
      return 0;
    });

    return {
      id: sorted[0].id,
      name: sorted[0].name,
      points: constants.polePositionPoints,
      reason: `Round ${number + 1} - Pole position`
    };
  });
}

function fastestLap(rounds) {
  return rounds.map((round, index) => {
    const sorted = round.results
      .filter(result => result.bestLapTime > 0)
      .sort((a, b) => {
        if (a.bestLapTime < b.bestLapTime) return -1;
        if (a.bestLapTime > b.bestLapTime) return 1;
        return 0;
      });

    const fastest = sorted[0];

    // Check 75% race distance was completed
    if (fastest.lapsCompleted < Math.floor(round.totalLaps * 0.75)) {
      return {
        id: fastest.id,
        name: fastest.name,
        points: 0,
        reason: `Round ${index + 1} - Fastest lap (Insufficient race distance)`
      };
    }
    
    return [
      {
        id: fastest.id,
        name: fastest.name,
        points: constants.fastestLapPoints,
        reason: `Round ${index + 1} - Fastest lap`
      }
    ];
  }).flat();
}

function dropRound(rounds) {
  const flatResults = rounds.map(round => round.results).flat();
  const driverIds = flatResults.map(result => result.id);
  const uniqueDriverIds = [...new Set(driverIds)];

  return uniqueDriverIds.map(id => {
    const name = flatResults.find(item => item.id === id).name;
    const results = rounds.map(round => {
      const result = round.results.find(result => result.id === id);
      if (!result) return null;
      return { ...result, totalLaps: round.totalLaps };
    }).filter(item => Boolean(item));

    if (results.length < rounds.length) {
      return {
        id: id,
        name: name,
        points: 0,
        reason: "Drop round - Missed race"
      };
    }

    const points = results.map(result => {
      if (result.lapsCompleted < Math.floor(result.totalLaps * 0.75)) {
        return 0;
      }
      return constants.positionPoints[result.finishPosition + 1];
    });

    const sortedPoints = points.sort();
    const pointsToRemove = sortedPoints[0] > 0 ? (sortedPoints[0] * -1) : 0;
    return {
      id: id,
      name: name,
      points: pointsToRemove,
      reason: 'Drop round - Lowest points'
    };
  });
}

module.exports = {
  racePosition,
  polePosition,
  fastestLap,
  dropRound,
};
