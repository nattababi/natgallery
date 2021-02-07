import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Intro extends Component {

  render() {
    return (
      <div>
        <Link to='/albums'>
          <img className="" src='Logo.png' style={{maxWidth:'100%'}} alt="logo"/>
        </Link>
      </div>
    );
  }
}

export default Intro;