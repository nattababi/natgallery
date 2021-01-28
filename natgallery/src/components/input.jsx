import React, { Component } from 'react';

class Input extends Component {
  state = {}
  render() {
    const { name, label, error, ...rest } = this.props;

    return (
      <div className="form-group">
        <label htmlFor={this.props.name}>{this.props.label}</label>
        <input
          {...rest}
          name={name}
          id={name}
          className="form-control" />
        {error && <div className="alert alert-danger">{error}</div>}
      </div>

    );
  }
}

export default Input;