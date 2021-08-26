import React, { Component } from 'react';
import { ReactGhLikeDiff } from 'react-gh-like-diff';
import 'react-gh-like-diff/dist/css/diff2html.min.css';

class DiffToSaveModal extends Component {
  state = {
    past: '1234',
    current: '124456789',
  };

  componentDidMount() {}

  render() {
    return (
      <div className="App1234">
        <ReactGhLikeDiff
          options={{
            originalFileName: "TITLE",
            updatedFileName: "TITLE"
          }}
          past={"12ee3"}
          current={"1345"}
        />
      </div>
    );
  }
}

export default DiffToSaveModal;
