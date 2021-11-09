const utils = require('./utils');
const operations = require('./operations');
const parser = require('./parser');
const constants = require('./constants');

// TODO: Read all files from /inputs directory instead of explicitly importing each file.
const data = [
  require('./inputs/round-1.json'),
  require('./inputs/round-2.json'),
  require('./inputs/round-3.json'),
  require('./inputs/round-4.json'),
  require('./inputs/round-5.json'),
  require('./inputs/round-6.json'),
];

console.log('=====================================');
console.log('======== STANDINGS GENERATOR ========');
console.log('=====================================\n');

// TODO: Check that these directorys exist - create them if they don't.
utils.clearDirectory('logs');
utils.clearDirectory('outputs');

function processSeason(rounds, operations, outputName) {
  const allAllocations = [];
  operations.forEach(operation => {
    console.log('Applying operation:', operation.name);
    allocations = operation(rounds);
    // utils.writeJson(`./logs/${outputName}-${operation.name}.json`, allocations);
    // utils.writeData(`./logs/${outputName}-${operation.name}.csv`, utils.jsToCsv(allocations));
    allAllocations.push(...allocations);
  });
  // utils.writeJson(`./logs/${outputName}-allocations.json`, allAllocations);
  // utils.writeData(`./logs/${outputName}-allocations.csv`, utils.jsToCsv(allAllocations));
  const standings = utils.generateStandings(allAllocations);
  utils.writeJson(`./outputs/${outputName}-standings.json`, standings);
  utils.writeData(`./outputs/${outputName}-standings.csv`, utils.jsToCsv(standings));
}

processSeason(
  data.map(d => parser.parseRace(d)),
  [
    operations.polePosition,
    operations.racePosition,
    operations.fastestLap,
    operations.dropRound,
  ],
  'overall'
);

constants.divisions.forEach(division => {
  processSeason(
    data.map(d => parser.parseRace(d, division)),
    [
      operations.polePosition,
      operations.racePosition,
      operations.fastestLap,
      operations.dropRound,
    ],
    division.name
  );
});

console.log('Done\n');
