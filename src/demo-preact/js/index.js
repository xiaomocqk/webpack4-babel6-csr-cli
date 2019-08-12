// import '../styles/index.less';
import { h, render, Component } from 'preact';

/** @jsx h */

class Page extends Component {
  render(){
    return (
      <h1>Preact</h1>
    );
  }
}

render(<Page />, document.body);