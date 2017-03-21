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
      input: null,
      correct: false,
      active: false,
    };
    console.log(this.props);
    this.solution = this.props.solution;

    this.toggleActive = this.toggleActive.bind(this);
  }

  toggleActive() {
    this.setState({active: !this.state.active});
  }

  render() {
    let classList = `cell ${this.state.correct ? 'correct' : 'incorrect'} ${this.state.active ? 'active' : ''}`;
    return (
      <div 
        className={classList}
        onClick={this.toggleActive}>
      </div>
    );
  }
}
