export const crossword = {
  board: [
    [0, 0, 'F', 'B', 'I'],
    ['S', 'H', 'O', 'O', 'T'],
    ['C', 'O', 'U', 'R', 'T'],
    ['A', 'L', 'L', 'E', 'Y'],
    ['N', 'A', 'S', 0, 0]
  ],
  boardExt: [
    [
      {
        letter: null,
      },
      {
        letter: null,
      },
      {
        letter: 'F',
        across: 1,
        down: 1,
      },
      {
        letter: 'B',
        across: 1,
        down: 2,
      },
      {
        letter: 'I',
        across: 1,
        down: 3,
      }
    ],
    [
      {
        letter: 'S',
        across: 4,
        down: 4,
      },
      {
        letter: 'H',
        across: 4,
        down: 5,
      },
      {
        letter: 'O',
        across: 4,
        down: 1,
      },
      {
        letter: 'O',
        across: 4,
        down: 2,
      },
      {
        letter: 'T',
        across: 4,
        down: 3,
      }
    ],
    [
      {
        letter: 'C',
        across: 6,
        down: 4,
      },
      {
        letter: 'O',
        across: 6,
        down: 5,
      },
      {
        letter: 'U',
        across: 6,
        down: 1,
      },
      {
        letter: 'R',
        across: 6,
        down: 2,
      },
      {
        letter: 'T',
        across: 6,
        down: 3,
      }
    ],
    [
      {
        letter: 'A',
        across: 7,
        down: 4,
      },
      {
        letter: 'L',
        across: 7,
        down: 5,
      },
      {
        letter: 'L',
        across: 7,
        down: 1,
      },
      {
        letter: 'E',
        across: 7,
        down: 2,
      },
      {
        letter: 'Y',
        across: 7,
        down: 3,
      }
    ],
    [
      {
        letter: 'N',
        across: 8,
        down: 4,
      },
      {
        letter: 'A',
        across: 8,
        down: 5,
      },
      {
        letter: 'S',
        across: 8,
        down: 1,
      },
      {
        letter: null,
      },
      {
        letter: null,
      }
    ],
  ],
  words: {
    across: {
      1: {
        clue: 'Government org. in NBC\'s "The Blacklist"',
        y: 0,
        xStart: 2,
        xEnd: 4,
      },
      4: {
        clue: '"Go ahead, what\'s your question?"',
        y: 1,
        xStart: 0,
        xEnd: 4,
      },
      6: {
        clue: 'Tennis setting',
        y: 2,
        xStart: 0,
        xEnd: 4,
      },
      7: {
        clue: 'Bowling setting',
        y: 3,
        xStart: 0,
        xEnd: 4,
      },
      8: {
        clue: '"N.Y. State of Mind" rapper',
        y: 4,
        xStart: 0,
        xEnd: 2,
      },
    },
    down: {
      1: {
        clue: 'They lead to free throws',
        x: 2,
        yStart: 0,
        yEnd: 4,
      },
      2: {
        clue: '_____ to tears',
        x: 3,
        yStart: 0,
        yEnd: 3,
      },
      3: {
        clue: 'Tiny, informally',
        x: 4,
        yStart: 0,
        yEnd: 3,
      },
      4: {
        clue: 'Read, as a bar code',
        x: 0,
        yStart: 1,
        yEnd: 4,
      },
      5: {
        clue: 'Hello, in Honduras',
        x: 1,
        yStart: 1,
        yEnd: 4,
      },
    }
  }
}
