import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
          <Link className="navbar-brand" to="/">Natgallery</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">

              <li className="nav-item active">
                <Link className="nav-link" to="/albums">Albums<span className="sr-only">(current)</span></Link>
              </li>

              <li className="nav-item active">
                <Link className="nav-link" to="/search">Search<span className="sr-only">(current)</span></Link>
              </li>

            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;