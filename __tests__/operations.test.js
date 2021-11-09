const operations = require('../operations');

describe('racePosition operation', () => {
  it('handles valid race positions', () => {
    const race = {
      totalLaps: 100,
      results: [
        { id: 101, name: 'Driver 1', finishPosition: 0, lapsCompleted: 100 },
        { id: 102, name: 'Driver 2', finishPosition: 1, lapsCompleted: 100 },
        { id: 103, name: 'Driver 3', finishPosition: 2, lapsCompleted: 100 },
      ]
    };
    const allocations = operations.racePosition([race]);
    expect(allocations).toEqual([
      { id: 101, name: 'Driver 1', points: 40, reason: 'Round 1 - Finished P1' },
      { id: 102, name: 'Driver 2', points: 35, reason: 'Round 1 - Finished P2' },
      { id: 103, name: 'Driver 3', points: 30, reason: 'Round 1 - Finished P3' },
    ]);
  });

  it('handles insufficient race distance', () => {
    const race = {
      totalLaps: 100,
      results: [
        { id: 101, name: 'Driver 1', finishPosition: 0, lapsCompleted: 100 },
        { id: 102, name: 'Driver 2', finishPosition: 1, lapsCompleted: 100 },
        { id: 103, name: 'Driver 3', finishPosition: 2, lapsCompleted: 50 },
      ]
    };
    const allocations = operations.racePosition([race]);
    expect(allocations).toEqual([
      { id: 101, name: 'Driver 1', points: 40, reason: 'Round 1 - Finished P1' },
      { id: 102, name: 'Driver 2', points: 35, reason: 'Round 1 - Finished P2' },
      { id: 103, name: 'Driver 3', points: 0, reason: 'Round 1 - Finished P3 (Insufficient race distance)' },
    ])
  });
});

describe('polePosition operation', () => {
  it('generates correct allocation', () => {
    const race = {
      results: [
        { id: 101, name: 'Driver 1', startPosition: 1 },
        { id: 102, name: 'Driver 2', startPosition: 0 },
        { id: 103, name: 'Driver 3', startPosition: 2 },
      ]
    };
    const allocations = operations.polePosition([race]);
    expect(allocations).toEqual([
      { id: 102, name: 'Driver 2', points: 1, reason: 'Round 1 - Pole position' }
    ]);
  });
});

describe('fastestLap operation', () => {
  it('handles valid fastest lap', () => {
    const race = {
      totalLaps: 100,
      results: [
        { id: 101, name: 'Driver 1', bestLapTime: 100, lapsCompleted: 100 },
        { id: 102, name: 'Driver 2', bestLapTime: 200, lapsCompleted: 100 },
      ]
    };
    const allocations = operations.fastestLap([race]);
    expect(allocations).toEqual([
      { id: 101, name: 'Driver 1', points: 1, reason: 'Round 1 - Fastest lap' }
    ]);
  });

  it('handles insufficient race distance', () => {
    const race = {
      totalLaps: 100,
      results: [
        { id: 101, name: 'Driver 1', bestLapTime: 100, lapsCompleted: 50 },
        { id: 102, name: 'Driver 2', bestLapTime: 200, lapsCompleted: 100 },
      ]
    };
    const allocations = operations.fastestLap([race]);
    expect(allocations).toEqual([
      { id: 101, name: 'Driver 1', points: 0, reason: 'Round 1 - Fastest lap (Insufficient race distance)' }
    ]);
  });
});

describe('dropRound operation', () => {
  it('handles lowest points', () => {
    const races = [
      {
        totalLaps: 100,
        results: [
          { id: 101, name: 'Driver 1', finishPosition: 0, lapsCompleted: 100 },
          { id: 102, name: 'Driver 2', finishPosition: 1, lapsCompleted: 100 },
          { id: 103, name: 'Driver 3', finishPosition: 2, lapsCompleted: 100 },
        ]
      },
      {
        totalLaps: 100,
        results: [
          { id: 101, name: 'Driver 1', finishPosition: 1, lapsCompleted: 100 },
          { id: 102, name: 'Driver 2', finishPosition: 2, lapsCompleted: 100 },
          { id: 103, name: 'Driver 3', finishPosition: 0, lapsCompleted: 100 },
        ]
      }
    ];
    const allocations = operations.dropRound(races);
    expect(allocations).toEqual([
      { id: 101, name: 'Driver 1', points: -35, reason: 'Drop round - Lowest points' },
      { id: 102, name: 'Driver 2', points: -30, reason: 'Drop round - Lowest points' },
      { id: 103, name: 'Driver 3', points: -30, reason: 'Drop round - Lowest points' }
    ]);
  });

  it('handles missed races', () => {
    const races = [
      {
        totalLaps: 100,
        results: [
          { id: 101, name: 'Driver 1', finishPosition: 0, lapsCompleted: 100 },
          { id: 102, name: 'Driver 2', finishPosition: 2, lapsCompleted: 100 },
          { id: 103, name: 'Driver 3', finishPosition: 1, lapsCompleted: 100 },
        ]
      },
      {
        totalLaps: 100,
        results: [
          { id: 101, name: 'Driver 1', finishPosition: 1, lapsCompleted: 100 },
          { id: 102, name: 'Driver 2', finishPosition: 0, lapsCompleted: 100 },
        ]
      }
    ];
    const allocations = operations.dropRound(races);
    expect(allocations).toEqual([
      { id: 101, name: 'Driver 1', points: -35, reason: 'Drop round - Lowest points' },
      { id: 102, name: 'Driver 2', points: -30, reason: 'Drop round - Lowest points' },
      { id: 103, name: 'Driver 3', points: 0, reason: 'Drop round - Missed race' }
    ]);
  });

  it('handles insufficient race distance', () => {
    const races = [
      {
        totalLaps: 100,
        results: [
          { id: 101, name: 'Driver 1', finishPosition: 1, lapsCompleted: 100 },
          { id: 102, name: 'Driver 2', finishPosition: 0, lapsCompleted: 100 },
        ]
      },
      {
        totalLaps: 100,
        results: [
          { id: 101, name: 'Driver 1', finishPosition: 0, lapsCompleted: 100 },
          { id: 102, name: 'Driver 2', finishPosition: 1, lapsCompleted: 50 },
        ]
      }
    ];
    const allocations = operations.dropRound(races);
    expect(allocations).toEqual([
      { id: 101, name: 'Driver 1', points: -35, reason: 'Drop round - Lowest points' },
      { id: 102, name: 'Driver 2', points: 0, reason: 'Drop round - Lowest points' },
    ]);
  });

  it('handles insufficient race position higher than completed position', () => {
    const races = [
      {
        totalLaps: 100,
        results: [
          { id: 101, name: 'Driver 1', finishPosition: 0, lapsCompleted: 100 },
          { id: 102, name: 'Driver 2', finishPosition: 2, lapsCompleted: 100 },
          { id: 103, name: 'Driver 3', finishPosition: 1, lapsCompleted: 100 },
        ]
      },
      {
        totalLaps: 100,
        results: [
          { id: 101, name: 'Driver 1', finishPosition: 0, lapsCompleted: 100 },
          { id: 102, name: 'Driver 2', finishPosition: 1, lapsCompleted: 50 },
          { id: 103, name: 'Driver 3', finishPosition: 2, lapsCompleted: 50 },
        ]
      }
    ];
    const allocations = operations.dropRound(races);
    expect(allocations).toEqual([
      { id: 101, name: 'Driver 1', points: -40, reason: 'Drop round - Lowest points' },
      { id: 102, name: 'Driver 2', points: 0, reason: 'Drop round - Lowest points' },
      { id: 103, name: 'Driver 3', points: 0, reason: 'Drop round - Lowest points' },
    ]);
  });
});