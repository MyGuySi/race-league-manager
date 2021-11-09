const fs = require('fs');
const path = require('path');

function clearDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    fs.unlinkSync(path.join(directory, file));
  }
}

function writeJson(outputPath, data) {
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 4));
}

function writeData(outputPath, data) {
  fs.writeFileSync(outputPath, data);
}

function getRaceSession(sessions) {
  const raceSession = sessions.find(item => item.simsession_name === 'RACE');
  if (!raceSession) {
    throw new Error('Could not find race session'); 
  }
  return raceSession;
}

function generateStandings(allocations, scope) {
  const drivers = allocations.reduce((standings, allocation) => {
    const { id, name, points } = allocation;
    if (!standings[id]) {
      standings[id] = { id, name, points: 0 };
    }
    standings[id].points += points;
    return standings;
  }, {});
  return Object.values(drivers).sort((a, b) => {
    if (a.points > b.points) return -1;
    if (a.points < b.points) return 1;
    return 0;
  });
}

function jsToCsv(data) {
  const replacer = (key, value) => value === null ? '-' : value // specify how you want to handle null values here
  const header = Object.keys(data[0])
  const csv = [
    header.join(','), // header row first
    ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n')
  return csv;
}

module.exports = {
  clearDirectory,
  writeJson,
  writeData,
  getRaceSession,
  generateStandings,
  jsToCsv,
};
