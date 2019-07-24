// import '../styles/index.less';
import { Component, createElement as h } from 'react';
import { render } from 'react-dom';

class Page extends Component {
  state = {
    text: 'Hello React Demo！'
  }

  render(){
    return <h1>{this.state.text}</h1>
  }
}

render(<Page />, document.getElementById('app'));