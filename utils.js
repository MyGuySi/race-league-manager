const fs = require('fs');
const path = require('path');

function clearDirectory(directory) {
  fs.readdirSync(directory, (err, files) => {
    console.log('read directory', directory);
    if (err) throw err;
    for (const file of files) {
      fs.unlinkSync(path.join(directory, file), err => {
        console.log('deleted file', file);
        if (err) throw err;
      });
    }
  });
}

function writeJson(outputPath, data) {
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 4));
}

function getRaceSession(sessions) {
  const raceSession = sessions.find(item => item.simsession_name === 'RACE');
  if (!raceSession) {
    throw new Error('Could not find race session'); 
  }
  return raceSession;
}

function generateStandings(allocations) {
  const drivers = allocations.reduce((standings, allocation) => {
    const [driverId, name, points] = allocation;
    if (!standings[driverId]) {
      standings[driverId] = { id: driverId, name, points: 0 };
    }
    standings[driverId].points += points;
    return standings;
  }, {});
  return Object.values(drivers).sort((a, b) => {
    if (a.points > b.points) return -1;
    if (a.points < b.points) return 1;
    return 0;
  });
}

module.exports = {
  clearDirectory,
  writeJson,
  getRaceSession,
  generateStandings,
};
