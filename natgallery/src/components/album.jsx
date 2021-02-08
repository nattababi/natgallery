import React, { Component } from 'react';
//import { getAlbum } from '../services/googleService';
import { Link } from 'react-router-dom';

class Album extends Component {

  async componentDidMount() {

  }

  handleClick = async () => {
    console.log("album clicked");
    //let photos = await getAlbum(this.props.albumId);
    //this.setState({ photos });
  }

  render() {
    return (

      <div style={{ position: 'relative', height: '200px', width: '300px', margin: '4px 4px 4px 4px', overflow: 'hidden', display: 'inline-block' }}>

        <div style={{ margin: '4px 4px 4px 4px' }} style={{ position: 'absolute', bottom: '0', background: 'white', width: '100%', height: '100%', padding: '0px' }}>

          <Link key={this.props.albumId} to={'/albumdetails?album=' + this.props.albumId + '&title=' + this.props.albumTitle} >
            <img key={this.props.albumId + '-img'} src={this.props.coverUrl} style={{ width: '300px', borderRadius: '0%', margin: '0 0 0 0' }} />
          </Link>

        </div>

        <div style={{ margin: '4px 4px 4px 4px' }} style={{ position: 'absolute', bottom: '0', background: 'rgba(0, 0, 0, 0.5)', color: '#f1f1f1', width: '300px', height: '70px', padding: '18px' }}>

          <div style={{ marginTop: '5px' }} >{this.props.children}</div>
          <div style={{ marginTop: '-3px', color: '#9C9EA1', align: 'left', fontSize: '12px' }}>{this.props.mediaItemsCount} items</div>

        </div>

      </div>

    );
  }
}

export default Album;