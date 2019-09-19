import React from 'react';
import { render } from 'react-dom';
import WangEditor from 'wangeditor';

import '../styles/index.less';


let editor = new WangEditor('.editor-toolbar', '#editor');
let initialHTML = `<p style="text-align: center;">初始化的内容</p><p>初始化的内容</p><p>&lt;script&gt;123&lt;/script&gt;</p>`;
let previewEl;

function App() {
  // let [value, setValue] = useState(0);

  return (
    <React.Fragment>
      <div className="editor-container">
        <div className="editor-toolbar"></div>
        <div
          id="editor"
          dangerouslySetInnerHTML={{
            __html: initialHTML
          }}
        ></div>
      </div>
      <div className="preview">
        <article
          ref={el => previewEl = el}
          dangerouslySetInnerHTML={{
            __html: initialHTML
          }}
        ></article>
      </div>
    </React.Fragment>
  );
}

render(
  <App />,
  document.getElementById('app')
);

initEditor();

function initEditor() {
  // https://www.kancloud.cn/wangfupeng/wangeditor3/332599
  editor.customConfig.menus = [
    'head',
    'bold',
    'italic',
    'underline',
    'list',
    'justify', 
    'table',
    'undo',
  ];

  editor.customConfig.onchange = function (html) {
    previewEl.innerHTML = html;
  };

  editor.create();
}