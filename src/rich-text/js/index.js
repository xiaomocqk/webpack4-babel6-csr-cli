/* 参考文档 https://braft.margox.cn */

import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import BraftEditor from 'braft-editor';
import ColorPicker from 'braft-extensions/dist/color-picker';
// import xss from 'xss';
import 'braft-editor/dist/index.css';
import 'braft-extensions/dist/color-picker.css';

import '../styles/index2.less';
// import '../styles/preview.less';


const editorDefaultConfig = {
  id: 'editor-with-color-picker',
  stripPastedStyles: true,// 以纯文本模式粘贴内容
  placeholder: '请输入内容~',
  controls: [
    'undo', 'redo', 'separator',
    'headings', 'font-size', 'line-height', 'separator',
    'bold', 'italic', 'underline', 'strike-through', 'text-color', 'hr', 'separator',
    'text-align', 'separator',
    'list-ul', 'list-ol', 'separator',
    'blockquote', 'code', 'emoji', 'separator',
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
  ]
};
BraftEditor.use(ColorPicker({
  includeEditors: [editorDefaultConfig.id],
  theme: 'light' // 支持dark和light两种主题，默认为dark
}));

function App() {
  const htmlContent = BraftEditor.createEditorState(`<p>初始化的内容</p><p>初始化的内容2</p><p>&lt;script&gt;123&lt;/script&gt;</p>`);
  let [title, setTitle] = useState('初始化标题');
  let [ editorState, setEditorState ] = useState(htmlContent);

  useEffect(() => {
    let { anchorOffset, focusOffset } = editorState.getSelection();

    if (anchorOffset - focusOffset !== 0) {
      console.log('有选中文字');
    } else {
      console.log('无选中文字');
    }

    console.log(editorState);
    

    // console.log(selection);
  }, [editorState]);

  return (
    <React.Fragment>
      <input
        className="set-title"
        placeholder="请设置页面标题"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <div className="main-container">
        <div className="bar">
          <div className="icon icon-red"></div>
          <div className="icon icon-yellow"></div>
          <div className="icon icon-green"></div>
          <span className="title">{title}</span>
        </div>
        <BraftEditor
          {...editorDefaultConfig}
          value={editorState}
          onChange={editorState => {
            // console.log(editorState);
            // const contentState = editorState.getCurrentContent();
            // const contentStateWithEntity = contentState.createEntity(
            //   'LINK',
            //   'MUTABLE',
            //   {url: 'http://www.zombo.com'}
            // );
            // const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

            // console.log(entityKey);
            // console.log(editorState.getSelection().anchorKey);
            // console.log('entityKey', entityKey);

            // console.log(editorState.getSelection());
            
            
            setEditorState(editorState);
          }}
          // blockStyleFn={contentBlock => {
          //   // console.log(contentBlock);
          //   key = contentBlock.getKey();
          // }}
          // blockRenderMap={(contentBlock) => console.log(contentBlock)}
          blockRendererFn={(contentBlock) => {
            console.log(contentBlock.getData());
            contentBlock.getData()._root.entries[0][1]['data-test']='test';
          }}
        />
        <button className="btn-submit" onClick={() => console.log(editorState.toJS())}>提交</button>
      </div>
      <div
        className="previewer"
      >
        <div className="previewer-title">{title}</div>
        <div className="previewer-content" dangerouslySetInnerHTML={{__html: editorState.toHTML()}}></div>
      </div>
    </React.Fragment>
  );
}

render(
  <App />,
  document.getElementById('app')
);