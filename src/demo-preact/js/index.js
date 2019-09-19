// import '../styles/index.less';
import { h, render, Component } from 'preact';
import { If, Each } from '../widgets/index.js';

/** @jsx h */

class Page extends Component {
  render(){
    return (
      <main>
        <h1>Preact</h1>
        <hr />
        <If tag="strong" condition={true} className="if">
          {'<If-Component>'}
        </If>
        <hr />
        <Each
          tag="ul"
          data={['A', 'B', 'C']}
          render={renderList}
          className="each"
        />
      </main>
    );

    function renderList(item, index) {
      return <li>{index}: {'<Each-Component>'} Child {item}</li>;
    }
  }
}

render(<Page />, document.body);