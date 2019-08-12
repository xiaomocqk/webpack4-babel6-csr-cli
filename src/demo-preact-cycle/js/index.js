import '../styles/index.less';
import { Component } from 'preact';
import { h, render } from 'preact-cycle';

/** @jsx h */

let state = {
  list: [],
  ids: '',
  content: '',
  disabled: true,
};

class App extends Component {
  componentWillMount(){
    let { mutation } = this.props;
    let response = [
      {
        "tips": "其他",
        "name": "其他",
        "id": 592
      }, {
        "tips": "",
        "name": "搜索结果相关性差",
        "id": 593
      }
    ];
    setTimeout(mutation('list', response), 1000);
  }

  render({ list, content, disabled, mutation }){
    return (
      <div id="app">
        <List data={list} />
        <div className="forms">
          <textarea
            maxLength="50"
            value={content}
            onKeyUp={mutation(KEYUP)}
          ></textarea>
          <button
            className="btn-submit"
            disabled={disabled}
            onClick={() => console.log('Submit')}
          >
            提交
          </button>
        </div>
      </div>
    );

    function List({ data }) {
      return (
        <ul className="list">
          {data.map((item, index) => (
            <li
              className={item.isActive ? 'active' : ''}
              onClick={mutation(CHECK, item)}
              key={index}
            >
              <i className="circle"></i>
              <span>{item.name}</span>
            </li>
          ))}
          <li className="other">其他问题：</li>
        </ul>
      );
    }
  }
}

let cannotSubmit = (ids, content) => !(ids.length || content.length);

let CHECK = (state, item) => {
  item.isActive = !item.isActive;

  let activeList = state.list.filter(v => v.isActive);

  state.ids = activeList.map(v => v.id).join(',');
  state.disabled = cannotSubmit(state.ids, state.content);

  return state;
};

let KEYUP = (state, event) => {
  state.content = event.target.value.replace(/^\s+/, '');
  state.disabled = cannotSubmit(state.ids, state.content);
  return state;
};

render(App, state, document.body);