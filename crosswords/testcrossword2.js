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
        yStart: 0,
        yEnd: 0,
        xStart: 2,
        xEnd: 4,
      },
      4: {
        clue: '"Go ahead, what\'s your question?"',
        yStart: 1,
        yEnd: 1,
        xStart: 0,
        xEnd: 4,
      },
      6: {
        clue: 'Tennis setting',
        yStart: 2,
        yEnd: 2,
        xStart: 0,
        xEnd: 4,
      },
      7: {
        clue: 'Bowling setting',
        yStart: 3,
        yEnd: 3,
        xStart: 0,
        xEnd: 4,
      },
      8: {
        clue: '"N.Y. State of Mind" rapper',
        yStart: 4,
        yEnd: 4,
        xStart: 0,
        xEnd: 2,
      },
    },
    down: {
      1: {
        clue: 'They lead to free throws',
        xStart: 2,
        xEnd: 2,
        yStart: 0,
        yEnd: 4,
      },
      2: {
        clue: '_____ to tears',
        xStart: 3,
        xEnd: 3,
        yStart: 0,
        yEnd: 3,
      },
      3: {
        clue: 'Tiny, informally',
        xStart: 4,
        xEnd: 4,
        yStart: 0,
        yEnd: 3,
      },
      4: {
        clue: 'Read, as a bar code',
        xStart: 0,
        xEnd: 0,
        yStart: 1,
        yEnd: 4,
      },
      5: {
        clue: 'Hello, in Honduras',
        xStart: 1,
        xEnd: 1,
        yStart: 1,
        yEnd: 4,
      },
    }
  }
}
