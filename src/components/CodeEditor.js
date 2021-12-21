import React from 'react';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-json';

const CodeEditor = (props) => {
  const { value, onChange, mode = 'javascript' } = props;

  return (
    <AceEditor
      mode={mode}
      width={666}
      theme="monokai"
      value={value}
      onChange={onChange}
      fontSize={14}
      showGutter={true}
      showPrintMargin={true}
      highlightActiveLine={true}
      setOptions={{
        tabSize: 2,
        enableSnippets: false,
        showLineNumbers: true,
        enableLiveAutocompletion: true,
        enableBasicAutocompletion: true,
      }}
    />
  );
};
export default CodeEditor;
