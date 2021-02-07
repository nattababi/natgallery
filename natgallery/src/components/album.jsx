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

      <div className="" key={this.props.albumId + '-div'} style={{
        position: 'relative',
        height: '200px',
        margin: '4px 4px 4px 4px',
        overflow: 'hidden',
        display: 'inline-block'
      }}>
        <Link key={this.props.albumId} to={'/albumdetails?album=' + this.props.albumId + '&title=' + this.props.albumTitle} >
          <img key={this.props.albumId + '-img'} src={this.props.coverUrl} style={{
            width: '300px',
            borderRadius: '0%',
            margin: '0 0 0 0'
          }} />
        </Link>
        <div style={{
          margin: '4px 4px 4px 4px',
        }}
          key={this.props.albumId + '-ttl'} style={{ position: 'absolute', bottom: '0', background: 'rgba(0, 0, 0, 0.5)', color: '#f1f1f1', width: '300px', height: '70px', padding: '18px' }}>
          {/* <h1>{this.props.children}</h1> */}
          <p key={this.props.albumId + '-ttl-p2'}>{this.props.children}</p>
        </div>
      </div>

    );
  }
}

export default Album;

//<div key={this.props.albumId + '-div'} style={{position: 'relative', maxWidth: '800px', margin: '0 auto'}}>
//      <p key={this.props.albumId + '-ttl-p1'}>
//          <Link key={this.props.albumId} to={'/albumdetails/'+this.props.albumId} >
//            <img key={this.props.albumId + '-ttl-img'} src={this.props.coverUrl} style={{width: '300px', borderRadius: '0%'}}/>
//          </Link>
//        </p>
//        <div key={this.props.albumId + '-ttl'} style={{position: 'absolute', bottom: '0', background: 'rgba(0, 0, 0, 0.5)', color: '#f1f1f1', width: '300px', padding: '20px'}}>
//          {/* <h1>{this.props.children}</h1> */}
//          <p key={this.props.albumId + '-ttl-p2'}>{this.props.children}</p>
//        </div>
//      </div>