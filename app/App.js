import React from 'react';
import ReactDOM from 'react-dom';
import './styles.scss';
import {crossword} from '../crosswords/testcrossword2';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      activeIndex: -1,
    }
    this.dims = {
      height: 5,
      width: 5,
    };
    this.refDict = {};

    this.setActive = this.setActive.bind(this);

    this.boardArr = crossword.board;
  }

  setActive(index) {
    if (index == this.state.activeIndex) {
      this.setState({activeIndex: -1});
    } else {
      this.setState({activeIndex: index});
    }
    this.refDict[index].textInput.focus();
  }

  render() {
    return (
      <div className='board'>
        {this.boardArr.map((row, rowIndex) => {
          return (
            <div className='row' key={rowIndex}>
              {row.map((letter, index) => {
                const i = index + row.length * rowIndex;
                if (letter == 0) {
                  return <div className='block' key={i}></div>
                } else {
                return (
                  <Cell 
                    key={i} 
                    solution={letter}
                    index={i}
                    activeIndex={this.state.activeIndex}
                    setActive={this.setActive}
                    ref={cellObj => this.refDict[i] = cellObj}/>
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
    this.props.setActive(this.props.index);
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
      this.props.setActive(this.props.index+1);
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
    let isActive = this.props.activeIndex == this.props.index;
    let classList = `cell ${this.state.correct ? 'correct' : 'incorrect'} ${isActive ? 'active' : ''}`;
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


