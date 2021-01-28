import React, { Component } from 'react';
import Input from './input';

class Form extends Component {
  state = {
    data: {},
    errors: {}
  }

  validate = () => {
    return false;
  }

  validateProperty = ({ name, value }) => {
    return false;
  }

  handleSubmit = (e) => {
    console.log('handle submit');
    e.preventDefault();
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data })
  }

  renderButton(label) {
    return <button
      disabled={this.validate()}
      className="btn btn-primary">{label}
    </button>
  }

  renderInput(name, label, type = 'text') {

    //get value if parameter exists
    //this.state.data[name] = value;

    const { data } = this.state;
    return <Input
      type={type}
      name={name}
      value={data[name]}
      label={label}
      onChange={this.handleChange}
    />
  }

}

export default Form;