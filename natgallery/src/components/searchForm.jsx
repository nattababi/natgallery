import React from 'react';
import Form from './form';

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
  }

  doSubmit = async () => {
    console.log('do submit');

    console.log(this.selected.join(","));

    window.location = "/albumDetails?keyword=" + this.selected.join(",");
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
          
        </div>
        
      </form>

      <button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Large modal</button>

      <div className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      123
    </div>
  </div>
</div>

    </div>);
  }
}

export default RegisterForm;

// {"filters":{"contentFilter":{"includedContentCategories":["SELFIES"]},"mediaTypeFilter":{"mediaTypes":["PHOTO"]}}}
// const parameters = {filters};