import React from 'react';
import Form from './form';
//import Joi from 'joi-browser';
//import auth from '../services/authService';
//import * as userService from '../services/userService';

class RegisterForm extends Form {
  state = {

  };

  selected = [];

  filterHandler = (evt) => {

    let checked = evt.target.checked;
    let name = evt.target.name;

    if (checked) {
      this.selected.push(name);
    }
    else {
      this.selected.splice(this.selected.indexOf(name), 1);
    }

    console.log(this.selected.join(","));
    //console.log(name, checked);
  }

  doSubmit = async () => {
    console.log('do submit');

    console.log(this.selected.join(","));

    window.location = "/albumDetails?keyword=" + this.selected.join(",");
    // try {
    //   const response = await userService.register(this.state.data);
    //   auth.loginWithJwt(response.headers['x-auth-token']);
    //   console.log(response);
    //   window.location = '/';
    // }
    // catch (ex) {
    //   if (ex.response && ex.response.status === 400) {
    //     const errors = { ...this.state.errors };
    //     errors.username = ex.response.data;
    //     this.setState({ errors });
    //   }
    // }
  }

  render() {
    return (<div>
      <form onSubmit={this.handleSubmit}>
        <div className="input-group mb-3">
          <div className="input-group-prepend">

            {this.renderButton("Search")}

            <div className="input-group-text">
              <input type="checkbox" name="nature" onClick={this.filterHandler} />
              <label className="mt-2 m-2">Nature</label>
            </div>

            <div className="input-group-text">
              <input type="checkbox" name="selfies" onClick={this.filterHandler} />
              <label className="mt-2 m-2">Selfies</label>
            </div>

            <div className="input-group-text">
              <input type="checkbox" name="food" onClick={this.filterHandler} />
              <label className="mt-2 m-2">Food</label>
            </div>

            <div className="input-group-text">
              <input type="checkbox" name="weddings" onClick={this.filterHandler} />
              <label className="mt-2 m-2">Weddings</label>
            </div>

            <div className="input-group-text">
              <input type="checkbox" name="sport" onClick={this.filterHandler} />
              <label className="mt-2 m-2">Sport</label>
            </div>

            <div className="input-group-text">
              <input type="checkbox" name="pets" onClick={this.filterHandler} />
              <label className="mt-2 m-2">Pets</label>
            </div>

            <div className="input-group-text">
              <input type="checkbox" name="cityscapes" onClick={this.filterHandler} />
              <label className="mt-2 m-2">Cityscapes</label>
            </div>

            <div className="input-group-text">
              <input type="checkbox" name="nature" onClick={this.filterHandler} />
              <label className="mt-2 m-2">Nature</label>
            </div>

          </div>
          <input type="text" className="form-control" aria-label="Text input with checkbox" />
        
          
        </div>
        
      </form>

    </div>);
  }
}

export default RegisterForm;

// {"filters":{"contentFilter":{"includedContentCategories":["SELFIES"]},"mediaTypeFilter":{"mediaTypes":["PHOTO"]}}}
// const parameters = {filters};