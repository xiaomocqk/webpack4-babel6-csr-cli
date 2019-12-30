import React, { useEffect } from 'react';
import reactDOM from 'react-dom';
import jssdk from 'meetyou.jssdk';

import '../styles/index.less';

require('eruda').init();

function App() {
  return (
    <div>
      <A />
      <B />
    </div>
  );
}


function A() {
  useEffect(() => {
    jssdk.listenEvent('onPageShow', {}, function(){
      console.log('Component A');
    });
  }, []);

  return (
    <h1>Component A</h1>
  );
}
function B() {
  useEffect(() => {
    jssdk.listenEvent('onPageShow', {}, function(){
      console.log('Component B');
    });
  }, []);

  return (
    <h1>Component B</h1>
  );
}

reactDOM.render(<App />, document.getElementById('root'));
