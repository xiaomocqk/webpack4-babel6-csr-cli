/* 参考文档 https://braft.margox.cn */

import React, { useState } from 'react';
import { render } from 'react-dom';
import BraftEditor from 'braft-editor';
import ColorPicker from 'braft-extensions/dist/color-picker';
// import xss from 'xss';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/color-picker.css';

import '../styles/index2.less';
// import '../styles/preview.less';


const editorDefaultConfig = {
  stripPastedStyles: true,// 以纯文本模式粘贴内容
  placeholder: '请输入内容~',
  controls: [
    'undo', 'redo', 'separator',
    'headings', 'font-size', 'line-height', 'separator',
    'bold', 'italic', 'underline', 'strike-through', 'text-color', 'hr', 'separator',
    'text-align', 'separator',
    'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
    'superscript', 'subscript', 'separator',
    'text-indent', 'text-align', 'separator',
    'link', 'separator',
    'remove-styles',
    {key:'clear', title: '清空内容', text: '清空'},
  ],
  fontSizes: [
    9, 10, 11,
    12, 13, 14,
    15, 16, 17,
    18, 19, 20,
    22, 24, 26,
    28, 29, 30
  ],
  hooks: {
    'toggle-link': (...a) => {
      console.log(a);
    }
  }
};
BraftEditor.use(ColorPicker({
  includeEditors: ['editor-with-color-picker'],
  theme: 'light' // 支持dark和light两种主题，默认为dark
}));

function App() {
  const htmlContent = BraftEditor.createEditorState(`<p>初始化的内容</p><p>初始化的内容</p><p>&lt;script&gt;123&lt;/script&gt;</p>`);
  let [ editorState, setEditorState ] = useState(htmlContent);

  return (
    <React.Fragment>
      <div className="editor-container">
        <BraftEditor
          {...editorDefaultConfig}
          id="editor-with-color-picker"
          value={editorState}
          onChange={editorState => setEditorState(editorState)}
        />
        <button className="btn-submit">提交</button>
      </div>
      <div
        className="previewer"
        dangerouslySetInnerHTML={{__html: editorState.toHTML()}}
      ></div>
    </React.Fragment>
  );
}

render(
  <App />,
  document.getElementById('app')
);