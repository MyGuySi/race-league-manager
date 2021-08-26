const utils = require('./utils');
const constants = require('./constants');

function addPositionPoints(rounds) {
  return rounds.map((round, number) => {
    const race_session = utils.getRaceSession(round.session_results);
    const total_laps_complete = race_session.results[0].laps_complete;
    return race_session.results.map(result => {
      const { cust_id, display_name, finish_position, laps_complete } = result;
      // Check 75% race distance was completed
      if (laps_complete < Math.floor(total_laps_complete * 0.75)) {
        return [cust_id, display_name, 0, `Round ${number} - Insufficient race distance`];
      }
      const points = constants.positionPoints[finish_position] || 0;
      return [cust_id, display_name, points, `Round ${number + 1} - Finish position P${finish_position + 1}`];
    });
  }).flat();
}

function addPolePositionPoints(rounds) {
  return rounds.map((round, number) => {
    const race_session = utils.getRaceSession(round.session_results);
    const sorted = race_session.results.sort((a, b) => {
      if (a.starting_position < b.starting_position) return -1;
      if (a.starting_position > b.starting_position) return 1;
      return 0;
    });
    return [sorted[0].cust_id, sorted[0].display_name, constants.polePositionPoints, `Round ${number + 1} - Pole position`];
  });
}

function addFastestLapPoints(rounds) {
  return rounds.map((round, number) => {
    const raceSession = utils.getRaceSession(round.session_results);
    const sorted = raceSession.results
      .filter(result => result.best_lap_time > 0)
      .sort((a, b) => {
        if (a.best_lap_time < b.best_lap_time) return -1;
        if (a.best_lap_time > b.best_lap_time) return 1;
        return 0;
      });
    return [
      [sorted[0].cust_id, sorted[0].display_name, constants.fastestLapPoints, `Round ${number + 1} - Fastest lap`]
    ];
  }).flat();
}

function addFastestLapPerDivisionPoints(rounds) {
  return rounds.map((round, number) => {
    const raceSession = utils.getRaceSession(round.session_results);
    return Object.entries(constants.divisions).map(([division, drivers]) => {
      const results = raceSession.results.filter(result => drivers.includes(result.display_name) && result.best_lap_time > 0);
      const sorted = results.sort((a, b) => {
        if (a.best_lap_time < b.best_lap_time) return -1;
        if (a.best_lap_time > b.best_lap_time) return 1;
        return 0;
      });
      return [
        [sorted[0].cust_id, sorted[0].display_name, constants.fastestLapPoints, `Round ${number + 1} - Fastest lap (${division})`]
      ];
    });
  }).flat(2);
}

function removeLowestPositionPoints(rounds) {
  const flatResults = rounds.map(round => utils.getRaceSession(round.session_results).results).flat();
  const cust_ids = flatResults.map(result => result.cust_id);
  const unique_cust_ids = [...new Set(cust_ids)];
  return unique_cust_ids.map((cust_id) => {
    const display_name = flatResults.find(item => item.cust_id === cust_id).display_name;
    const positions = flatResults.filter(result => result.cust_id === cust_id).map(result => result.position);
    if (positions.length < rounds.length) {
      return [cust_id, display_name, 0, "Drop week - missed race"];
    }
    const sortedPositions = positions.sort((a, b) => b - a);
    const lowestPosition = sortedPositions[0];
    const pointsToRemove = (constants.positionPoints[lowestPosition] || 0) * -1;
    return [cust_id, display_name, pointsToRemove, "Drop week - lowest points"];
  });
}

module.exports = [
  addPositionPoints,
  addPolePositionPoints,
  addFastestLapPoints,
  // addFastestLapPerDivisionPoints,
  removeLowestPositionPoints,  
]