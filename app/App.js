import React from 'react';
import ReactDOM from 'react-dom';
import './styles.scss';
import {crossword} from '../crosswords/testcrossword2';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      activeX: 2,
      activeY: 0,
      activeXstart: 2,
      activeXend: 4,
      activeYstart: 0,
      activeYend: 0,
    }
    this.dims = {
      height: 5,
      width: 5,
    };
    this.refDict = {};

    this.boardArr = crossword.board;

    this.setActive = this.setActive.bind(this);
    this.getIndex = this.getIndex.bind(this);
    this.moveForward = this.moveForward.bind(this);
  }

  setActive(x, y) {
    this.setState({activeX: x, activeY: y});
    this.refDict[this.getIndex(x, y)].textInput.focus();
  }

  moveForward(x, y) {
    do {
      x++;
      if (x == this.dims.width) {
        x = 0;
        y++;
        if (y == this.dims.height) y = 0;
      }
    } while (this.boardArr[y][x] == 0);
    this.setActive(x, y);
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
              {row.map((letter, x) => {
                const index = this.getIndex(x, y);
                if (letter == 0) {
                  return <div className='block' key={index}></div>
                } else {
                return (
                  <Cell 
                    key={index} 
                    solution={letter}
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
  }

  toggleActive() {
    this.props.setActive(this.props.x, this.props.y);
  }

  handleChange(e) {
    let input = '';
    let correct = false;
    if (e.target.value.length == 2) {
      input = e.target.value.slice(1).toUpperCase();
    } else {
      input = e.target.value.toUpperCase();
    }
    if (input == this.solution) {
      correct = true;
    }
    this.setState({
      input: input,
      correct: correct,
    });
    if (input.length == 1) {
      this.props.moveForward(this.props.x, this.props.y);
    }
  }

  handleKeyPress(e) {
    if (e.keyCode == 9) {
      // tab pressed
      e.preventDefault();
      this.props.setActive(this.props.index+1);
    } else if (e.keyCode == 8) {
      // backspace pressed
      this.props.setActive(this.props.index-1);
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
        className={classList}
        onClick={this.toggleActive}>{this.state.input}
        <input 
          value={this.state.input} 
          onChange={this.handleChange}
          onKeyDown={this.handleKeyPress}
          ref={input => this.textInput = input}/>
      </div>
    );
  }
}


