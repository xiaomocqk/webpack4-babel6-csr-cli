// import '../styles/index.less';
import { h, render } from 'preact-cycle';

let state = {
  score: 59,
  newScore: 100
};

const App = () => (
  <div id="app">
    <h1>Preact-cycle</h1>
    <Head {...state}></Head>
  </div>
);

let CHANGE = (state, value, event) => {
  state.score = value;
};

const Head = ({ score, newScore }, { mutate, mutation }) => (
  <div>
    <div>我的成绩是：{score} 分</div>
    <input value={newScore} onKeyUp={e => mutate('newScore', e.target.value)} />
    <button onClick={mutation(CHANGE, newScore)}>我要改分</button>
    <div>
      <input value={score} onInput={e => mutate('score', e.target.value)} />
    </div>
  </div>
);

render(App, state, document.body);