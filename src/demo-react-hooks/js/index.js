// import '../styles/index.less';
import React, { useState, useEffect, useContext } from 'react';
import { render } from 'react-dom';
import { GlobalContext, GlobalProvider } from '../store/store';

function App() {
  const [count, setCount] = useState(0);
  const { appName, setAppName } = useContext(GlobalContext);

  useEffect(() => {
    document.title = count;
    console.log('count', count);
    return () => {
      console.log('页面卸载', count);
    };
  }, [count]);

  return (
    <div>
      <h1>你点击了{count}次</h1>
      <a href="weixin://">打开微信</a>
      <button onClick={() => setCount(count+1)}>点击</button>
      <hr/>
      <h1>Global state: {appName}</h1>
      <button onClick={() => setAppName('new AppName')}>点击</button>
    </div>
  );
}

render(
  <GlobalProvider>
    <App />
  </GlobalProvider>,
  document.getElementById('app')
);