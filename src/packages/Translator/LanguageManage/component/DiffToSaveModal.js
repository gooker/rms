import React, { Component } from 'react';
import ReactDiffViewer from 'react-diff-viewer';

class DiffToSaveModal extends Component {
  state = {
    past: {
      a: '2',
      b: '3',
    },
    current: {
      a: '3',
      b: '3',
      c: '3',
    },
  };

  render() {
    return (
      <div className="App">
        <ReactDiffViewer
          splitView={true}
          oldValue={JSON.stringify(this.state.past,null, 4)}
          newValue={JSON.stringify(this.state.current,null, 4)}
        />
      </div>
    );
  }
}

export default DiffToSaveModal;
