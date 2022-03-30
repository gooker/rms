import React, { useEffect } from 'react';
import E from 'wangeditor';

let editor = null;
function Editor(props) {
  const { content, onEditorContent, index } = props;

  useEffect(() => {
    editor = new E(`#rich_editor${index}`);
    // 设置编辑区域高度为 500px
    editor.config.height = 500;
    // 设置编辑区提示文字
    editor.config.placeholder = '';
    //图片base64格式
    editor.config.uploadImgShowBase64 = true;
    // 配置菜单
    editor.config.menus = [
      'head',
      'bold',
      'fontSize',
      //'fontName',
      'italic',
      'underline',
      // 'strikeThrough',
      // 'indent',
      'lineHeight',
      'foreColor',
      //'backColor',
      //'link',
      //'list',
      //'todo',
      'justify',
      //'quote',
      //'emoticon',
      'image',
      // 'video',
      'table',
      //'code',
      //'splitLine',
      //'undo',
      //'redo',
    ];
    // 取消自动 focus
    editor.config.focus = false;
    // 配置全屏功能按钮是否展示
    editor.config.showFullScreen = false;
    // 初始化
    editor.create();
    // 编辑器change事件回调
    editor.config.onchange = (newHtml) => {
      onEditorContent(newHtml);
    };

    return () => {
      editor.destroy();
    };
  }, []);

  useEffect(() => {
    if (editor) {
      editor.txt.html(content);
    }
  }, [content]);

  return (
    <div>
      <div id={`rich_editor${index}`} className="rich_editor"></div>
    </div>
  );
}

export default Editor;
