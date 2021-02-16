import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

@inject('albumStore')
@observer
class Intro extends Component {

  async componentDidMount() {
    await this.props.albumStore.cacheAlbums();
  }
  
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