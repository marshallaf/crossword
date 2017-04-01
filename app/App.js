import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './styles.scss';
import {convertCrossword} from './convertCrossword';
import {crossword} from '../crosswords/testcrossword2';

export default class App extends React.Component {
  constructor() {
    super();

    let crossword = {
      board: [],
    };

    this.dims = {
      height: 0,
      width: 0,
    };

    this.state = {
      activeWord: null,
      crossword: crossword,
    };

    this.across = true;

    this.setup = this.setup.bind(this);
    this.setActiveWord = this.setActiveWord.bind(this);
    this.changeDirection = this.changeDirection.bind(this);
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

    this.setState({
      crossword: newCrossword,
      activeWord: newCrossword.words.across[0],
    });
  }

  setActiveWord(x, y) {
    let direction = this.across ? 'across' : 'down';
    let wordNo = this.state.crossword.board[y][x][direction];
    let word = this.state.crossword.words[direction][wordNo];
    this.setState({ activeWord: word });
  }

  changeDirection(x, y) {
    this.across = !this.across;
    this.setActiveWord(x, y);
  }

  render() {
    return (
      <div className="container">
        <Board 
          crossword={this.state.crossword}
          dims={this.dims}
          activeWord={this.state.activeWord}
          setActiveWord={this.setActiveWord}
          across={this.across}
          changeDirection={this.changeDirection}/>
        <Clues words={this.state.crossword.words} />
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
  }


  setActive(x, y) {
    console.log(x, y);
    this.setState({
      activeX: x, 
      activeY: y,
    });
    this.props.setActiveWord(x, y);
    this.refDict[this.getIndex(x,y)].square.focus();
    console.log(this.refDict[this.getIndex(x,y)]);
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
    } while (!this.boardArr[y][x].letter);
    this.setActive(x, y);
    this.refDict[this.getIndex(x, y)].writeLetter('');
  }

  moveWordForward(x, y) {
    // get the current word
    let word;
    if (this.across) {
      let wordNo = this.boardArr[y][x].across + 1;
      if (this.crossword.words.across.length == wordNo) {
        word = this.crossword.words.down[0];
        this.across = false;
      } else {
        word = this.crossword.words.across[wordNo];
      }
    } else {
      let wordNo = this.boardArr[y][x].down + 1;
      if (this.crossword.words.down.length == wordNo) {
        word = this.crossword.words.across[0];
        this.across = true;
      } else {
        word = this.crossword.words.down[wordNo];
      }
    }

    // set the active cell to xStart and yStart
    this.setActive(word.xStart, word.yStart);
  }

  moveWordBackward(x, y) {
    // get the current word
    let wordNo, word;
    if (this.across) {
      wordNo = this.boardArr[y][x].across;
      word = this.crossword.words.across[wordNo-1];
    } else {
      wordNo = this.boardArr[y][x].down;
      word = this.crossword.words.down[wordNo-1];
    }

    // set the active cell to xStart and yStart
    this.setActive(word.xStart, word.yStart);
  }

  handleArrows(keyCode) {
    let x = this.state.activeX;
    let y = this.state.activeY;
    if (keyCode == 38 || keyCode == 40) {
      // up + down
      if (this.across) {
        this.across = false;
        this.setActive(x, y);
      } else {
        if (keyCode == 38) this.moveBackward(x, y);
        else this.moveForward(x, y);
      }
    } else {
      // left + right
      if (!this.across) {
        this.across = true;
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
                      activeWord={this.props.activeWord}
                      activeX={this.state.activeX}
                      activeY={this.state.activeY}
                      setActive={this.setActive}
                      moveForward={this.moveForward}
                      moveBackward={this.moveBackward}
                      moveWordForward={this.moveWordForward}
                      moveWordBackward={this.moveWordBackward}
                      changeDirection={this.props.changeDirection}
                      handleArrows={this.handleArrows}
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


