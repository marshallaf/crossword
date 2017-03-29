import React from 'react';
import ReactDOM from 'react-dom';
import './styles.scss';
import {crossword} from '../crosswords/testcrossword2';

export default class App extends React.Component {
  constructor() {
    super();
    this.dims = {
      height: 5,
      width: 5,
    };
    this.refDict = {};
    this.across = true;
    this.wordIndex = 0;

    this.crossword = crossword;
    this.boardArr = crossword.boardExt;
    const word = this.crossword.words.across[0];

    this.state = {
      activeX: word.xStart,
      activeY: word.yStart,
      activeXstart: word.xStart,
      activeXend: word.xEnd,
      activeYstart: word.yStart,
      activeYend: word.yEnd,
      activeWord: word,
    }

    this.setActive = this.setActive.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.moveForward = this.moveForward.bind(this);
    this.moveBackward = this.moveBackward.bind(this);
    this.changeDirection = this.changeDirection.bind(this);
    this.moveWordForward = this.moveWordForward.bind(this);
    this.moveWordBackward = this.moveWordBackward.bind(this);
  }

  setActive(x, y) {
    let wordNo, word;
    if (this.across) {
      wordNo = this.boardArr[y][x].across;
      word = this.crossword.words.across[wordNo];
    } else {
      wordNo = this.boardArr[y][x].down;
      word = this.crossword.words.down[wordNo];
    }
    this.setState({
        activeX: x, 
        activeY: y,
        activeXstart: word.xStart,
        activeXend: word.xEnd,
        activeYstart: word.yStart,
        activeYend: word.yEnd,
        activeWord: word,
      });
    this.refDict[this.getIndex(x,y)].square.focus();
  }

  // move a single cell forward, in the current direction
  moveForward(x, y) {
    do {
      x++;
      if (x == this.dims.width) {
        x = 0;
        y++;
        if (y == this.dims.height) y = 0;
      }
    } while (!this.boardArr[y][x].letter);
    this.setActive(x, y);
  }

  // move a single cell backward, in the current direction
  moveBackward(x, y) {
    do {
      x--;
      if (x < 0) {
        x = this.dims.width-1;
        y--;
        if (y < 0) y = this.dims.height-1;
      }
    } while (!this.boardArr[y][x].letter);
    this.setActive(x, y);
    this.refDict[this.getIndex(x, y)].writeLetter('');
  }

  moveWordForward(x, y) {
    // get the current word
    let wordNo, word;
    if (this.across) {
      wordNo = this.boardArr[y][x].across;
      word = this.crossword.words.across[wordNo+1];
    } else {
      wordNo = this.boardArr[y][x].down;
      word = this.crossword.words.down[wordNo+1];
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

  changeDirection() {
    this.across = !this.across;
    this.setActive(this.state.activeX, this.state.activeY);
  }

  getIndex(x, y) {
    return y * this.dims.width + x;
  }

  render() {
    return (
      <div className='board'>
        {this.boardArr.map((row, y) => {
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
                    activeXstart={this.state.activeXstart}
                    activeXend={this.state.activeXend}
                    activeYstart={this.state.activeYstart}
                    activeYend={this.state.activeYend}
                    activeX={this.state.activeX}
                    activeY={this.state.activeY}
                    setActive={this.setActive}
                    moveForward={this.moveForward}
                    moveBackward={this.moveBackward}
                    moveWordForward={this.moveWordForward}
                    moveWordBackward={this.moveWordBackward}
                    changeDirection={this.changeDirection}
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
    console.log(e);
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
      this.props.changeDirection();
    } else if (e.keyCode >= 65 && e.keyCode <= 90) {
      this.writeLetter(e.key);
      this.props.moveForward(this.props.x, this.props.y);
    }
  }

  render() {
    let isActive = this.props.x == this.props.activeX && this.props.y == this.props.activeY;
    const isWordActive = this.props.x >= this.props.activeXstart && 
                         this.props.x <= this.props.activeXend &&
                         this.props.y >= this.props.activeYstart &&
                         this.props.y <= this.props.activeYend;
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


