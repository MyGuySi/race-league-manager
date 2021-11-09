const utils = require('./utils');

function parseRace(data, division) {
  const raceSession = utils.getRaceSession(data.session_results);

  let results = raceSession.results;
  if (division) {
    results = results.filter(result => division.drivers.includes(result.display_name));
  }

  // Overwrite starting_position to account for removal of drivers no in the selected division
  results = results.sort((a, b) => {
    if (a.starting_position > b.starting_position) return 1;
    if (a.starting_position < b.starting_position) return -1;
    return 0;
  }).map((result, index) => ({ ...result, starting_position: index }));
  
  // Overwrite finish_position to account for removal of drivers no in the selected division
  results = results.sort((a, b) => {
    if (a.finish_position > b.finish_position) return 1;
    if (a.finish_position < b.finish_position) return -1;
    return 0;
  }).map((result, index) => ({ ...result, finish_position: index }));

  return {
    trackName: data.track.track_name,
    totalLaps: data.event_laps_complete,
    results: results.map(result => ({
      id: result.cust_id,
      name: result.display_name,
      division: division ? division.name : null,
      startPosition: result.starting_position,
      finishPosition: result.finish_position,
      bestLapTime: result.best_lap_time,
      lapsCompleted: result.laps_complete,
    }))
  }
}

module.exports = {
  parseRace
};
