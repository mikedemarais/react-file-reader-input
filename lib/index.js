'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HIDDEN_INPUT_STYLE = {
  // If user passes in children, display children and hide input.
  position: 'absolute',
  top: '-9999px'
};

var FileInput = function (_Component) {
  _inherits(FileInput, _Component);

  function FileInput(props) {
    _classCallCheck(this, FileInput);

    var _this = _possibleConstructorReturn(this, (FileInput.__proto__ || Object.getPrototypeOf(FileInput)).call(this, props));
    // FileReader compatibility warning.


    _this.handleChange = function (event) {
      var files = [];
      for (var i = 0; i < event.target.files.length; i++) {
        // Convert to Array.
        files.push(event.target.files[i]);
      }

      // Build Promise List, each promise resolved by FileReader.onload.
      Promise.all(files.map(function (file) {
        return new Promise(function (resolve, reject) {
          var reader = new FileReader();

          reader.onload = function (result) {
            // Resolve both the FileReader result and its original file.
            resolve([result, file]);
          };

          // Read the file with format based on this.props.as.
          switch ((_this.props.as || 'url').toLowerCase()) {
            case 'binary':
              {
                reader.readAsBinaryString(file);
                break;
              }
            case 'buffer':
              {
                reader.readAsArrayBuffer(file);
                break;
              }
            case 'text':
              {
                reader.readAsText(file);
                break;
              }
            case 'url':
              {
                reader.readAsDataURL(file);
                break;
              }
          }
        });
      })).then(function (zippedResults) {
        // Run the callback after all files have been read.
        _this.props.onChange(event, zippedResults);
      });
    };

    _this.setInputRef = function (ref) {
      return _this._reactFileReaderInput = ref;
    };

    _this.triggerInput = function () {
      return (0, _reactDom.findDOMNode)(_this._reactFileReaderInput).click();
    };

    _this.renderHiddenInput = function () {
      return _react2.default.createElement('input', _extends({}, (0, _lodash.omit)(_this.props, ['children', 'wrapperRenderer']), {
        onChange: _this.handleChange,
        ref: _this.setInputRef,
        style: _this.props.children ? HIDDEN_INPUT_STYLE : {},
        type: 'file'
      }));
    };

    _this.render = function () {
      return (0, _react.createElement)(_this.props.wrapperRenderer, {
        children: [_this.renderHiddenInput(), _this.props.children],
        onClick: _this.triggerInput
      });
    };

    var win = (typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' ? window : {};
    if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object' && (!win.File || !win.FileReader || !win.FileList || !win.Blob)) {
      console.warn('[react-file-reader-input] Some file APIs detected as not supported.' + ' File reader functionality may not fully work.');
    }
    return _this;
  }

  return FileInput;
}(_react.Component);

FileInput.propTypes = {
  as: _react.PropTypes.oneOf(['binary', 'buffer', 'text', 'url']),
  children: _react.PropTypes.any,
  onChange: _react.PropTypes.func,
  wrapperRenderer: _react.PropTypes.func
};
FileInput.defaultProps = {
  wrapperRenderer: _react2.default.createElement('div', null)
};
exports.default = FileInput;