const utils = require('./utils');
const operations = require('./operations');
const constants = require('./constants');

const rounds = [
  require('./inputs/round-1.json'),
  require('./inputs/round-2.json'),
  require('./inputs/round-3.json'),
  require('./inputs/round-4.json'),
  require('./inputs/round-5.json'),
];

console.log('\n=====================================');
console.log('======== STANDINGS GENERATOR ========');
console.log('=====================================\n');

utils.clearDirectory('logs');
utils.clearDirectory('outputs');

// const pointsAllocations = [];

// const tempRounds = rounds.map(round => ({
//     ...round,
//     session_results: round.session_results.map(session => ({
//       ...session,
//       results: session.results.filter(result => constants.divisions.Pro.includes(result.display_name)),
//     }))
//   }
// ));

// utils.writeJson('./logs/tmp.json', tempRounds);

// operations.forEach(operation => {
//   console.log('Applying operation:', operation.name);
//   const allocations = operation(tempRounds);
//   pointsAllocations.push(...allocations);
//   utils.writeJson(`./logs/${operation.name}.json`, allocations);
// });

// // log allocations
// utils.writeJson('./logs/points-allocations.json', pointsAllocations);

// const standings = utils.generateStandings(pointsAllocations);
// utils.writeJson('./outputs/standings.json', standings);

// console.log('Done');
