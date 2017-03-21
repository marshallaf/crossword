import React from 'react';
import './styles.scss';

export default class App extends React.Component {
  render() {
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXY'.split('');
    return (
      <div>
        {letters.map((letter, index) => <Cell key={index} solution={letter}/>)}
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
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  toggleActive() {
    this.setState({active: !this.state.active});
  }

  handleKeyPress(e) {
    e.preventDefault();
    console.log(e);
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
  }

  render() {
    let classList = `cell ${this.state.correct ? 'correct' : 'incorrect'} ${this.state.active ? 'active' : ''}`;
    return (
      <div 
        className={classList}
        onClick={this.toggleActive}>{this.state.input}
        <input value={this.state.input} onChange={this.handleChange} />
      </div>
    );
  }
}
