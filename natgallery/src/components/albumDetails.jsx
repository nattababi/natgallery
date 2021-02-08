import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';

@inject('albumStore')
@observer
class AlbumDetails extends Component {
  title = "";
  albumId = "";

  async componentDidMount() {

    //TODO: albums list read twice when navigating directly to album
    const parsed = queryString.parse(window.location.search);

    if (parsed.title) {
      this.title = parsed.title;
    }

    if (parsed.album) {
      //search by album
      this.albumId = parsed.album;
      console.log("cdm-try to load images");
      await this.props.albumStore.cacheAlbumImages(this.albumId);
    }
    else if (parsed.keyword) {
      await this.props.imageStore.getSearch(parsed.keyword);
    };

  }

  GetAlbumDate(d1, d2) {
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

    const parsed = queryString.parse(window.location.search);

    // todo: add search parsed.search
    if (!parsed.album) return (<div>No album defined</div>);

    if (!this.props.albumStore.albums) {
      return (
        <LoadingOverlay
          active={true}
          spinner
          text=''
        >
          <div style={{ border: '3px solid #fff', padding: '20px', textAlign: 'left' }}>
            Loading albums first...
          </div>
        </LoadingOverlay>
      );
    }

    const album = this.props.albumStore.albums.find(x => x.id === parsed.album);

    if (!album) return (<div>Invalid album ID</div>);

    const title = album.title;

    let strDateDisplay = '';

    // load current images
    //await async 

    if (album.images && album.images.length !== 0) {
      strDateDisplay = this.GetAlbumDate(
        album.images[0].mediaMetadata.creationTime,
        album.images[album.images.length - 1].mediaMetadata.creationTime);
    }

    const isActive = (album.images) ? false : true;

    return (
      <div>
        <LoadingOverlay active={isActive} spinner text=''>

          <div>
            <span key={'span-1'} className="m-2" style={{ fontSize: '34px' }}>{title}</span>
            <span key={'span-2'} style={{ color: '#5F6368', marginLeft: '2px' }}>{strDateDisplay}</span>
          </div>

          {isActive ?
            <div style={{ marginLeft: "8px" }}>Loading {album.mediaItemsCount} images...</div> :
            album.images.map(item => (
              <div key={item.id + '-div'} style={{ position: 'relative', height: '200px', margin: '4px', overflow: 'hidden', display: 'inline-block' }}>
                {item.mimeType.startsWith('image/') ?
                  <Link key={item.id + '-lnk'} to={"/carousel?album=" + parsed.album + "&image=" + item.id}>
                    <img className="" key={item.id + '-img'} src={item.baseUrl} style={{ height: '200px' }} />
                  </Link> :
                  <video key={item.id + '-vid'} src={item.baseUrl + '=dv'} type={item.mimeType} controls style={{ height: '200px', padding: '2px', width: 'auto', backgroundColor: '#666' }} />}
              </div>
            ))
          }

        </LoadingOverlay>

      </div>
    );
  }
}

export default AlbumDetails;

 //src={item.baseUrl + '=w256-h256'}
