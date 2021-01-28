import React, { Component } from 'react';
import { getAlbum, getSearch } from '../services/googleService';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import moment from 'moment';

class Albumdetails extends Component {
  state = {
    photos: []
  }
  title = "";
  albumId = "";

  async componentDidMount() {

    let photos = [];

    const parsed = queryString.parse(window.location.search);

    if (parsed.title) {
      this.title = parsed.title;
    }

    if (parsed.album) {
      //search by album
      this.albumId = parsed.album;
      console.log('Calling getAlbum with ', this.albumId);

      photos = await getAlbum(this.albumId);
    }

    else if (parsed.keyword) {
      console.log("SEARCH with=", parsed.keyword);
      photos = await getSearch(parsed.keyword);
    };

    this.setState({ photos });
  }

  GetAlbumDate(d1, d2){
    let strDate1 = moment(d1).format('ll');
    let strDate2 = moment(d2).format('ll');

    let year1 = moment(d1).format('YYYY');
    let year2 = moment(d2).format('YYYY');

    if ((strDate1 !== strDate2) && (year1 === year2)) {
      // remove year from 1st string
      strDate1 = strDate1.replace(", " + year1, "");
    }

    return (strDate1 === strDate2) ? strDate1 : strDate1 + ' - ' + strDate2;
  }

  render() {
    let title = this.title;
    let albumId = "";

    const parsed = queryString.parse(window.location.search);

    if (parsed.album) {
      //search by album
      albumId = parsed.album;
    }

    let strDateDisplay = '';
    
    if (this.state.photos.length > 0) {
      strDateDisplay = this.GetAlbumDate(this.state.photos[0].mediaMetadata.creationTime, this.state.photos[this.state.photos.length - 1].mediaMetadata.creationTime);
    }

    return (
      <div>
        <div>
          <span className="m-2" style={{ fontSize: '34px' }}>{title}</span>
          <span style={{ color: '#5F6368', marginLeft: '2px' }}>{strDateDisplay}</span>
        </div>
        {this.state.photos.map(item => (
          <div key={item.id + '-div'} style={{
            position: 'relative',
            height: '200px',
            margin: '4px',
            overflow: 'hidden',
            display: 'inline-block'
          }}>
            {item.mimeType.startsWith('image/') ?
              <Link key={item.id + '-lnk'} to={"/carousel?album=" + albumId + "&image=" + item.id}>
                <img className="" key={item.id + '-img'} src={item.baseUrl} style={{ height: '200px' }} />
              </Link> :

              <video
                key={item.id + '-vid'}
                src={item.baseUrl + '=dv'}
                type={item.mimeType}
                controls
                style={{ height: '200px', padding: '2px', width: 'auto', backgroundColor: '#666' }} />}
          </div>
        ))}
      </div>
    );
  }
}

export default Albumdetails;

 //src={item.baseUrl + '=w256-h256'}
