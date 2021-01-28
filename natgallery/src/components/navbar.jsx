import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Route } from 'react-router-dom';
import Albums from './albums';
import AlbumDetails from './albumDetails';
import searchForm from './searchForm';
import Carousel from './carousel';

class Navbar extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
          <Link className="navbar-brand" to="#">Natgallery</Link>
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

        <div>
          <Route path="/albums" component={Albums} />
          <Route path="/albumdetails" component={AlbumDetails} />
          <Route path="/search" component={searchForm} />
          <Route path="/carousel" component={Carousel} />
        </div>
      </div>
    );
  }
}

export default Navbar;