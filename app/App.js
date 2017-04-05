import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './styles.scss';
import {convertCrossword} from './convertCrossword';
import {crossword} from '../crosswords/testcrossword2';

export default class App extends React.Component {
  constructor() {
    super();

    this.crossword = {
      board: [],
      words: {
        across: [],
        down: [],
      },
    };

    this.dims = {
      height: 0,
      width: 0,
    };

    this.state = {
      wordStatusAcross: [],
      wordStatusDown: [],
      activeWordIndex: {across: 0, down: 0},
      numCorrect: 0,
    }

    this.across = true;

    this.setup = this.setup.bind(this);
    this.setActiveWord = this.setActiveWord.bind(this);
    this.changeDirection = this.changeDirection.bind(this);
    this.updateWord = this.updateWord.bind(this);
  }

  componentDidMount() {
    const debug = true;
    if (debug) {
      fetch('./testcrossword.xml')
        .then(res => res.text())
        .then(astext => convertCrossword(astext))
        .then(converted => {
          this.setup(converted);
        },
        error => {console.error('problem reading crossword', error)});
    } else {
      this.setup(crossword);
    }
  }


  setup(newCrossword) {
    this.dims = {
      height: newCrossword.board.length,
      width: newCrossword.board[0].length,
    };

    this.across = true;
    this.crossword = newCrossword;
    this.numCells = newCrossword.board.reduce((acc, row) => {
      return acc + row.reduce((acc, cell) => {
        if (cell.letter) return acc + 1;
        else return acc;
      }, 0);
    }, 0);

    this.state = {
      wordStatusAcross: [],
      wordStatusDown: [],
      activeWordIndex: {across: 0, down: 0},
      numCorrect: 0,
    }
    this.forceUpdate();
  }

  setActiveWord(x, y) {
    const direction = this.across ? 'across' : 'down';
    const newActive = {across: this.crossword.board[y][x].across,
                       down: this.crossword.board[y][x].down};
    this.setState({activeWordIndex: newActive});
  }

  changeDirection(x, y) {
    this.across = !this.across;
    this.setActiveWord(x, y);
  }

  updateWord(letterStatus) {
    // update total board correctness
    const numCorrect = this.state.numCorrect + letterStatus;
    if (numCorrect == this.numCells) alert('You win');

    // update word correctness
    // across correctness
    let activeWord = this.crossword.words.across[this.state.activeWordIndex.across];
    let wordLen = activeWord.xEnd - activeWord.xStart + 1;
    const wordStatusAcross = this.updateWordArray(this.state.wordStatusAcross, 
                                                  this.state.activeWordIndex.across,
                                                  letterStatus,
                                                  wordLen);


    // TODO: in order for this to work, you need to keep the index of both
    //       the across word index and the down word index. Keep it as an object
    //       in state.
    activeWord = this.crossword.words.down[this.state.activeWordIndex.down];
    wordLen = activeWord.yEnd - activeWord.yStart + 1;
    const wordStatusDown = this.updateWordArray(this.state.wordStatusDown, 
                                                  this.state.activeWordIndex.down,
                                                  letterStatus,
                                                  wordLen);

    this.setState({
      wordStatusAcross: wordStatusAcross, 
      wordStatusDown: wordStatusDown, 
      numCorrect: numCorrect,
    });
  }

  updateWordArray(array, index, status, length) {
    const newArray = array.slice();
    const wordObj = newArray[index] || { numCorrect: 0, correct: false };
    wordObj.numCorrect += status;
    if (wordObj.numCorrect == length) {
      wordObj.correct = true;
    }
    newArray[index] = wordObj;
    return newArray;
  }

  render() {
    return (
      <div className="container">
        <Board 
          crossword={this.crossword}
          dims={this.dims}
          activeWordIndex={this.state.activeWordIndex}
          setActiveWord={this.setActiveWord}
          across={this.across}
          changeDirection={this.changeDirection}
          updateWord={this.updateWord}/>
        <CluesContainer 
          words={this.crossword.words}
          wordStatusAcross={this.state.wordStatusAcross}
          wordStatusDown={this.state.wordStatusDown}
          activeWordIndex={this.state.activeWordIndex}
          across={this.across} />
      </div>
    );
  }
}

class CluesContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="wordsList">
        <div className="wordSet">
          <h3>Across</h3>
          <ClueList 
            words={this.props.words.across}
            wordStatus={this.props.wordStatusAcross}
            across={this.props.across}
            activeWordIndex={this.props.activeWordIndex.across}/>
        </div>
        <div className="wordSet">
          <h3>Down</h3>
          <ClueList 
            words={this.props.words.down}
            wordStatus={this.props.wordStatusDown}
            across={!this.props.across}
            activeWordIndex={this.props.activeWordIndex.down}/>
        </div>
      </div>
    );
  }
}

class ClueList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="clue-list">
        {this.props.words.map((word, index) => {
          const wordComplete = !!this.props.wordStatus[index] && 
                               this.props.wordStatus[index].correct;
          return (
            <Word word={word}
                  active={this.props.across && index == this.props.activeWordIndex}
                  complete={wordComplete} />
          )
        })}
      </div>
    )
  }
}

class Word extends React.Component {
  constructor(props) {
    super(props);
    this.wordP = null;
  }

  scrollTo() {
    if (this.wordP && this.props.active) {
      const scrollHeight = this.wordP.offsetTop;
      const list = this.wordP.parentElement;
      list.scrollTop = scrollHeight - list.offsetTop;
    }
  }

  render() {
    this.scrollTo();
    let activeClass = this.props.active ? 'active' : '';
    let completeClass = this.props.complete ? 'complete' : '';
    let classList = `word ${activeClass} ${completeClass}`;
    return (
      <p className={classList}
        ref={wordP => this.wordP = wordP}>
        <b>{this.props.word.number}:</b> {this.props.word.clue}
      </p>
    );
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.refDict = {};

    this.state = {
      activeX: 0,
      activeY: 0,
    };

    this.setActive = this.setActive.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.moveForward = this.moveForward.bind(this);
    this.moveBackward = this.moveBackward.bind(this);
    this.moveWordForward = this.moveWordForward.bind(this);
    this.moveWordBackward = this.moveWordBackward.bind(this);
    this.handleArrows = this.handleArrows.bind(this);
    this.getActiveWord = this.getActiveWord.bind(this);
  }


  setActive(x, y) {
    this.setState({
      activeX: x, 
      activeY: y,
    });
    this.props.setActiveWord(x, y);
    this.refDict[this.getIndex(x,y)].square.focus();
  }

  // move a single cell forward, in the current direction
  moveForward(x, y) {
    do {
      if (this.props.across) {
        x++;
        if (x == this.props.dims.width) {
          x = 0;
          y++;
          if (y == this.props.dims.height) y = 0;
        }
      } else {
        y++;
        if (y == this.props.dims.height) {
          y = 0;
          x++;
          if (x == this.props.dims.width) x = 0;
        }
      }
    } while (!this.props.crossword.board[y][x].letter);
    this.setActive(x, y);
  }

  // move a single cell backward, in the current direction
  moveBackward(x, y) {
    do {
      if (this.props.across) {
        x--;
        if (x < 0) {
          x = this.props.dims.width-1;
          y--;
          if (y < 0) y = this.props.dims.height-1;
        }
      } else {
        y--;
        if (y < 0) {
          y = this.props.dims.height-1;
          x--;
          if (x < 0) x = this.props.dims.width-1;
        }
      }
    } while (!this.props.crossword.board[y][x].letter);
    this.setActive(x, y);
    this.refDict[this.getIndex(x, y)].writeLetter('');
  }

  moveWordForward(x, y) {
    // get the current word
    const direction = this.props.across ? 'across' : 'down';
    const otherDir = this.props.across ? 'down' : 'across';
    let word;
    let wordNo = this.props.crossword.board[y][x][direction] + 1;
    if (this.props.crossword.words[direction].length == wordNo) {
      word = this.props.crossword.words[otherDir][0];
      this.props.changeDirection(word.xStart, word.yStart);
    } else {
      word = this.props.crossword.words[direction][wordNo];
    }

    // set the active cell to xStart and yStart
    this.setActive(word.xStart, word.yStart);
  }

  moveWordBackward(x, y) {
    // get the current word
    const direction = this.props.across ? 'across' : 'down';
    const otherDir = this.props.across ? 'down' : 'across';
    let word;
    let wordNo = this.props.crossword.board[y][x][direction] - 1;
    if (wordNo < 0) {
      const lastIndex = this.props.crossword.words[otherDir].length - 1;
      word = this.props.crossword.words[otherDir][lastIndex];
      this.props.changeDirection(word.xStart, word.yStart);
    } else {
      word = this.props.crossword.words[direction][wordNo];
    }

    // set the active cell to xStart and yStart
    this.setActive(word.xStart, word.yStart);
  }

  handleArrows(keyCode) {
    let x = this.state.activeX;
    let y = this.state.activeY;
    if (keyCode == 38 || keyCode == 40) {
      // up + down
      if (this.props.across) {
        this.props.changeDirection(x, y);
        this.setActive(x, y);
      } else {
        if (keyCode == 38) this.moveBackward(x, y);
        else this.moveForward(x, y);
      }
    } else {
      // left + right
      if (!this.props.across) {
        this.props.changeDirection(x, y);
        this.setActive(x, y);
      } else {
        if (keyCode == 37) this.moveBackward(x, y);
        else this.moveForward(x, y);
      }
    }
  }

  getIndex(x, y) {
    return y * this.props.dims.width + x;
  }

  getActiveWord() {
    if (this.props.across) {
      return this.props.crossword.words.across[this.props.activeWordIndex.across];
    } else return this.props.crossword.words.down[this.props.activeWordIndex.down];
  }

  render() {
    return (
      <div className='board'>
        {this.props.crossword.board.map((row, y) => {
          return (
            <div className='row' key={y}>
              {row.map((square, x) => {
                const index = this.getIndex(x, y);
                if (!square.letter) {
                  return <div className='block' key={index}></div>
                } else {
                  return (
                    <Cell 
                      key={index} 
                      solution={square.letter}
                      number={square.number || -1}
                      index={index}
                      x={x}
                      y={y}
                      activeWord={this.getActiveWord()}
                      activeX={this.state.activeX}
                      activeY={this.state.activeY}
                      setActive={this.setActive}
                      moveForward={this.moveForward}
                      moveBackward={this.moveBackward}
                      moveWordForward={this.moveWordForward}
                      moveWordBackward={this.moveWordBackward}
                      changeDirection={this.props.changeDirection}
                      handleArrows={this.handleArrows}
                      updateWord={this.props.updateWord}
                      ref={cellObj => this.refDict[index] = cellObj}/>
                  )
                }
              })}
            </div>
          )})}
      </div>
    )
  }
}

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      correct: false,
      active: false,
    };
    this.solution = this.props.solution;

    this.toggleActive = this.toggleActive.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.writeLetter = this.writeLetter.bind(this);
  }

  toggleActive() {
    this.props.setActive(this.props.x, this.props.y);
  }

  writeLetter(letter) {
    letter = letter.toUpperCase();
    let correct = false;
    if (letter == this.solution) {
      correct = true;
    }
    if (this.state.correct && !correct) {
      this.props.updateWord(-1);
    } else if (!this.state.correct && correct) {
      this.props.updateWord(1);
    }
    this.setState({
      input: letter,
      correct: correct,
    });
  }

  handleChange(e) {
    let input = e.target.value.slice(1).toUpperCase();
    if (input.length == 0 || input == ' ') {
      input = e.target.value.slice(0,1).toUpperCase();
      if (input == ' ') input = '';
    }
    this.writeLetter(input);
    if (input.length != 0) {
      this.props.moveForward(this.props.x, this.props.y);
    }
  }

  handleKeyPress(e) {
    e.preventDefault();
    if (e.keyCode == 9) {
      // tab pressed
      if (!e.shiftKey) {
        this.props.moveWordForward(this.props.x, this.props.y);
      } else {
        this.props.moveWordBackward(this.props.x, this.props.y);
      }
    } else if (e.keyCode == 8) {
      // backspace pressed
      if (this.state.input.length == 0)
        this.props.moveBackward(this.props.x, this.props.y);
      else this.writeLetter('');
    } else if(e.keyCode == 32) {
      // spacebar pressed
      this.props.changeDirection(this.props.x, this.props.y);
    } else if (e.keyCode >= 37 && e.keyCode <= 40) {
      // arrow keys pressed
      this.props.handleArrows(e.keyCode);
    } else if (e.keyCode >= 65 && e.keyCode <= 90) {
      this.writeLetter(e.key);
      // only move cell forward if not at the end of a word
      if (!(this.props.x == this.props.activeWord.xEnd && this.props.y == this.props.activeWord.yEnd))
        this.props.moveForward(this.props.x, this.props.y);
    }
  }

  render() {
    let isActive = this.props.x == this.props.activeX && this.props.y == this.props.activeY;
    const isWordActive = this.props.x >= this.props.activeWord.xStart && 
                         this.props.x <= this.props.activeWord.xEnd &&
                         this.props.y >= this.props.activeWord.yStart &&
                         this.props.y <= this.props.activeWord.yEnd;
    let classList = `cell ${this.state.correct ? 'correct' : 'incorrect'} ${isActive ? 'active' : ''} ${isWordActive ? 'word-active' : ''}`;
    return (
      <div 
        tabIndex='0'
        className={classList}
        onClick={this.toggleActive}
        onKeyDown={this.handleKeyPress}
        ref={square => this.square = square}>
        {this.props.number != -1 && <div className='number'>{this.props.number}</div>}
        {this.state.input}        
      </div>
    );
  }
}


