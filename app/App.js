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
      activeWordIndex: 0,
      numCorrect: 0,
    }

    this.across = true;

    this.setup = this.setup.bind(this);
    this.setActiveWord = this.setActiveWord.bind(this);
    this.changeDirection = this.changeDirection.bind(this);
    this.updateWord = this.updateWord.bind(this);
  }

  componentDidMount() {
    fetch('./testcrossword.xml')
      .then(res => res.text())
      .then(astext => convertCrossword(astext))
      .then(converted => {
        this.setup(converted);
      },
      error => {console.error('problem reading crossword', error)});
  }


  setup(newCrossword) {
    this.dims = {
      height: newCrossword.board.length,
      width: newCrossword.board[0].length,
    };

    this.across = true;
    this.crossword = newCrossword;

    this.state = {
      wordStatusAcross: [],
      wordStatusDown: [],
      activeWordIndex: 0,
      numCorrect: 0,
    }
    this.forceUpdate();
  }

  setActiveWord(x, y) {
    const direction = this.across ? 'across' : 'down';
    this.setState({activeWordIndex: this.crossword.board[y][x][direction]});
  }

  changeDirection(x, y) {
    this.across = !this.across;
    this.setActiveWord(x, y);
  }

  //TODO: you have to change the properties of the word object in the crossword, since
  // activeWord is not permanent. Better to just change activeWord to reflect the current word index.
  updateWord(letterStatus) {
    // update total board correctness
    const numCorrect = this.state.numCorrect + letterStatus;

    // update word correctness
    let wordLen, wordStatusArr;
    const direction = this.across ? 'across' : 'down';
    const activeWord = this.crossword.words[direction][this.state.activeWordIndex];
    if (this.across) {
      wordStatusArr = this.state.wordStatusAcross.slice();
      wordLen = activeWord.xEnd - activeWord.xStart;
    } else {
      wordStatusArr = this.state.wordStatusDown.slice();
      wordLen = activeWord.yEnd - activeWord.yStart;
    }
    let wordStatusObj = wordStatusArr[this.state.activeWordIndex];
    if (!wordStatusObj) {
      wordStatusObj = { numCorrect: 0, correct: false };
    }
    wordStatusObj.numCorrect += letterStatus;
    if (wordStatusObj.numCorrect == wordLen) {
      wordStatusObj.correct = true;
    }
    wordStatusArr[this.state.activeWordIndex] = wordStatusObj;

    if (this.across) {
      this.setState({wordStatusAcross: wordStatusArr, numCorrect: numCorrect});
    } else {
      this.setState({wordStatusDown: wordStatusArr, numCorrect: numCorrect});
    }
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
        <Clues 
          words={this.crossword.words}
          activeWord={this.activeWord}
          across={this.across} />
      </div>
    );
  }
}

class Clues extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="wordsList">
        <div className="wordSet">
          <h3>Across</h3>
          {this.props.words.across.map((word, index) => {
            if (word == this.props.activeWord) {
              return (
                <p className="wordList-active"><b>{word.number}:</b> {word.clue}</p>
              );
            } else {
              return (
                <p><b>{word.number}:</b> {word.clue}</p>
              );
            }
          })}
        </div>
        <div className="wordSet">
          <h3>Down</h3>
          {this.props.words.down.map((word, index) => {
            if (word == this.props.activeWord) {
              return (
                <p className="wordList-active"><b>{word.number}:</b> {word.clue}</p>
              );
            } else {
              return (
                <p><b>{word.number}:</b> {word.clue}</p>
              );
            }
          })}
        </div>
      </div>
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
      return this.props.crossword.words.across[this.props.activeWordIndex];
    } else return this.props.crossword.words.down[this.props.activeWordIndex];
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
    console.log(e.keyCode);
    if (e.keyCode == 9) {
      // tab pressed
      e.preventDefault();
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
      e.preventDefault();
      this.props.changeDirection(this.props.x, this.props.y);
    } else if (e.keyCode >= 37 && e.keyCode <= 40) {
      // arrow keys pressed
      this.props.handleArrows(e.keyCode);
    } else if (e.keyCode >= 65 && e.keyCode <= 90) {
      this.writeLetter(e.key);
      // only move cell forward if not at the end of a word
      if (!(this.props.x == this.props.activeXend && this.props.y == this.props.activeYend))
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
        {this.state.input}        
      </div>
    );
  }
}


