import React, { Component, createElement, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { omit } from 'lodash';

const HIDDEN_INPUT_STYLE = {
  // If user passes in children, display children and hide input.
  position: 'absolute',
  top: '-9999px',
};

export default class FileInput extends Component {
  static propTypes = {
    as: PropTypes.oneOf(['binary', 'buffer', 'text', 'url']),
    children: PropTypes.any,
    onChange: PropTypes.func,
    wrapperRenderer: PropTypes.func,
  }

  static defaultProps = {
    wrapperRenderer: <div />,
  };

  constructor(props) {
    // FileReader compatibility warning.
    super(props);

    const win = typeof window === 'object' ? window : {};
    if ((typeof window === 'object') && (!win.File || !win.FileReader || !win.FileList || !win.Blob)) {
      console.warn(
        '[react-file-reader-input] Some file APIs detected as not supported.' +
        ' File reader functionality may not fully work.'
      );
    }
  }

  handleChange = (event) => {
    const files = [];
    for (let i = 0; i < event.target.files.length; i++) {
      // Convert to Array.
      files.push(event.target.files[i]);
    }

    // Build Promise List, each promise resolved by FileReader.onload.
    Promise.all(files.map(file => new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = (result) => {
        // Resolve both the FileReader result and its original file.
        resolve([result, file]);
      };

      // Read the file with format based on this.props.as.
      switch ((this.props.as || 'url').toLowerCase()) {
        case 'binary': {
          reader.readAsBinaryString(file);
          break;
        }
        case 'buffer': {
          reader.readAsArrayBuffer(file);
          break;
        }
        case 'text': {
          reader.readAsText(file);
          break;
        }
        case 'url': {
          reader.readAsDataURL(file);
          break;
        }
      }
    })))
    .then((zippedResults) => {
      // Run the callback after all files have been read.
      this.props.onChange(event, zippedResults);
    });
  }

  setInputRef = ref => (this._reactFileReaderInput = ref)
  triggerInput = () => findDOMNode(this._reactFileReaderInput).click();

  renderHiddenInput = () => (
    <input
      {...omit(this.props, [ 'children', 'wrapperRenderer'])}
      onChange={this.handleChange}
      ref={this.setInputRef}
      style={this.props.children ? HIDDEN_INPUT_STYLE : {}}
      type="file"
    />
  );

  render = () =>
    createElement(this.props.wrapperRenderer, {
      children: [this.renderHiddenInput(), this.props.children],
      onClick: this.triggerInput,
    });
}
