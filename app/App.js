import React from 'react';
import './styles.scss';

export default class App extends React.Component {
  render() {
    return (
      <div><Cell solution='A'/><Cell solution='B'/></div>
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
    if (e.target.value.length == 2) {
      this.setState({input: e.target.value.slice(1)})
    } else {
      this.setState({input: e.target.value});
    }    
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
