const parser = require('../parser');

const raceData = require('../__mocks__/iracing-data.json');

describe('application', () => {
  it('parses iRacing race data', () => {
    const parsedRace = parser.parseRace(raceData);
    expect(parsedRace).toEqual({
      trackName: 'Test Track',
      totalLaps: 100,
      results: [
        {
          id: 101,
          name: 'Driver 1',
          division: null,
          startPosition: 2,
          finishPosition: 0,
          bestLapTime: 100,
          lapsCompleted: 100
        },
        {
          id: 102,
          name: 'Driver 2',
          division: null,
          startPosition: 0,
          finishPosition: 1,
          bestLapTime: 200,
          lapsCompleted: 100
        },
        {
          id: 103,
          name: 'Driver 3',
          division: null,
          startPosition: 1,
          finishPosition: 2,
          bestLapTime: 300,
          lapsCompleted: 50
        },
      ]
    });
  });

  it('filters results when division is passed', () => {
    const division = {
      name: 'test',
      drivers: [
        'Driver 1',
        'Driver 2'
      ],
    };
    const parsedRace = parser.parseRace(raceData, division);
    expect(parsedRace).toEqual({
      trackName: 'Test Track',
      totalLaps: 100,
      results: [
        {
          id: 101,
          name: 'Driver 1',
          division: 'test',
          startPosition: 1,
          finishPosition: 0,
          bestLapTime: 100,
          lapsCompleted: 100
        },
        {
          id: 102,
          name: 'Driver 2',
          division: 'test',
          startPosition: 0,
          finishPosition: 1,
          bestLapTime: 200,
          lapsCompleted: 100
        }
      ]
    });
  });
});
