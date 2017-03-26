export const crossword = {
  board: [
    [0, 0, 'F', 'B', 'I'],
    ['S', 'H', 'O', 'O', 'T'],
    ['C', 'O', 'U', 'R', 'T'],
    ['A', 'L', 'L', 'E', 'Y'],
    ['N', 'A', 'S', 0, 0]
  ],
  words: {
    across: [
      {
        clue: 'Government org. in NBC\'s "The Blacklist"',
        y: 0,
        xStart: 2,
        xEnd: 4,
      },
      {
        clue: '"Go ahead, what\'s your question?"',
        y: 1,
        xStart: 0,
        xEnd: 4,
      },
      {
        clue: 'Tennis setting',
        y: 2,
        xStart: 0,
        xEnd: 4,
      },
      {
        clue: 'Bowling setting',
        y: 3,
        xStart: 0,
        xEnd: 4,
      },
      {
        clue: '"N.Y. State of Mind" rapper',
        y: 4,
        xStart: 0,
        xEnd: 2,
      },
    ],
    down: [
      {
        clue: 'They lead to free throws',
        x: 2,
        yStart: 0,
        yEnd: 4,
      },
      {
        clue: '_____ to tears',
        x: 3,
        yStart: 0,
        yEnd: 3,
      },
      {
        clue: 'Tiny, informally',
        x: 4,
        yStart: 0,
        yEnd: 3,
      },
      {
        clue: 'Read, as a bar code',
        x: 0,
        yStart: 1,
        yEnd: 4,
      },
      {
        clue: 'Hello, in Honduras',
        x: 1,
        yStart: 1,
        yEnd: 4,
      },
    ]
  }
}
