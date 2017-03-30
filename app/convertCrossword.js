const xml2js = require('xml2js');

export function convertCrossword(crosswordXml) {
  const parser = new xml2js.Parser({mergeAttrs: true, explicitArray: false});
  return new Promise((resolve, reject) => {
    parser.parseString(crosswordXml, (err, result) => {
      if (err) {
        reject(Error(err));
      }
      const crossword = result['crossword-compiler']['rectangular-puzzle'].crossword;
      const board = new Array(parseInt(crossword.grid.height));
      const cells = crossword.grid.cell;
      cells.forEach(cell => {
        if (!board[cell.y-1]) board[cell.y-1] = new Array(parseInt(crossword.grid.width));
        if (!board[cell.y-1][cell.x-1]) board[cell.y-1][cell.x-1] = {};
        if (cell.hasOwnProperty('type') && cell.type == 'block') {
          board[cell.y-1][cell.x-1].letter = null;
        } else {
          board[cell.y-1][cell.x-1].letter = cell.solution;
        }
      });

      const words = { across: [], down: [] };

      for (let i = 0; i < 2; i++) {
        const inputClues = crossword.clues[i].clue;
        inputClues.forEach(clue => {
          const word = {};
          word.clue = clue._;
          word.id = parseInt(clue.word);
          word.number = parseInt(clue.number);
          if (i == 0) words.across.push(word);
          else words.down.push(word);
        });
      }

      crossword.word.forEach(inWord => {
        let x = inWord.x.split('-');
        let y = inWord.y.split('-');
        if (x.length == 2) {
          const outWord = words.across.find(el => el.id == parseInt(inWord.id));
          outWord.xStart = parseInt(x[0]) - 1;
          outWord.xEnd = parseInt(x[1]) - 1;
          outWord.yStart = parseInt(y[0]) - 1;
          outWord.yEnd = parseInt(y[0]) - 1;
        } else {
          const outWord = words.down.find(el => el.id == parseInt(inWord.id));
          outWord.xStart = parseInt(x[0]) - 1;
          outWord.xEnd = parseInt(x[0]) - 1;
          outWord.yStart = parseInt(y[0]) - 1;
          outWord.yEnd = parseInt(y[1]) - 1;
        }
      });

      resolve({ board: board, words: words });
    });
  });
}