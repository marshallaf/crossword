import React from 'react';
import ReactDOM from 'react-dom';
import './styles.scss';

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
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXY'.split('');
    return (
      <div className='board'>
        {letters.map((letter, index) => {
          return (
            <Cell 
              key={index} 
              solution={letter}
              index={index}
              activeIndex={this.state.activeIndex}
              setActive={this.setActive}
              ref={cellObj => this.refDict[index] = cellObj}/>
            )
      })}
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
    this.props.setActive(this.props.index+1);
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
          ref={input => this.textInput = input}/>
      </div>
    );
  }
}
