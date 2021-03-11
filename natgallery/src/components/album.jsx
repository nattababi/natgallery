import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

class Album extends Component {

  async componentDidMount() {

  }

  handleClick = async () => {
    console.log("album clicked");
  }

  
  render() {
  return (

      <div style={{ position: 'relative', height: '200px', width: '300px', margin: '4px 4px 4px 4px', overflow: 'hidden', display: 'inline-block' }}>

        <div style={{ margin: '4px 4px 4px 4px' }} style={{ position: 'absolute', bottom: '0', background: 'white', width: '100%', height: '100%', padding: '0px' }}>

          <Link key={this.props.albumId} to={'/albumdetails?title=' + this.props.albumTitle + '&album=' + this.props.albumId} >
            
            <div style={{  
              backgroundImage: "url(" + this.props.coverUrl + ")",
              backgroundPosition: '0% 25%',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              width: '300px', height: '200px', borderRadius: '1%', margin: '0 0 0 0'
            }}>
            </div>
          
            <div style={{ margin: '4px 4px 4px 4px' }} style={{ position: 'absolute', bottom: '0', background: 'rgba(0, 0, 0, 0.5)', color: '#f1f1f1', width: '300px', height: '70px', padding: '20px' }}>
              <div style={{ marginTop: '0px', width: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}} >{this.props.albumTitle}</div>
              <div style={{ marginTop: '-3px', color: '#9C9EA1', align: 'left', fontSize: '12px' }}>{this.props.mediaItemsCount} {this.props.mediaItemsCount === 1? "item" : "items"} {moment(this.props.saveDate).format('HH:mm')}</div>
            </div>

          </Link>

        </div>

        

      </div>

    );
  }
}

export default Album;

//<img key={this.props.albumId + '-img'} src={this.props.coverUrl} style={{ width: '300px', borderRadius: '1%', margin: '0 0 0 0' }} />