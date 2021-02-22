import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';
import SearchForm from './searchForm';
import InfiniteScroll from 'react-infinite-scroller';

@inject('albumStore')
@observer
class AlbumDetails extends Component {
  title = "";
  albumId = "";

  handleScrollAlbums = async () => {
    console.log('scroll albums');
    const parsed = queryString.parse(window.location.search);

    // TODO: check titles, maybe not needed
    if (parsed.title) {
      this.title = parsed.title;
    }

    if (parsed.album) {
      //search by album
      await this.props.albumStore.cacheAlbums();
    }
    else if (parsed.keyword) {
      // TODO search
      await this.props.albumStore.cacheSearchImages(parsed.keyword);
    };
  }

  handleScrollImages = async () => {

    console.log('scroll images');
    const parsed = queryString.parse(window.location.search);

    if (parsed.title) {
      this.title = parsed.title;
    }

    if (parsed.album) {
      //search by album
      this.albumId = parsed.album;
      await this.props.albumStore.cacheAlbumImages(this.albumId);
    }
    else if (parsed.keyword) {
      // TODO
      await this.props.albumStore.cacheSearchImages(parsed.keyword);
    };
  }

  async componentDidMount() {
  }

  GetAlbumDate(d1, d2) {

    // date
    let strDate1 = moment(d1).format('ll');
    let strDate2 = moment(d2).format('ll');

    if (strDate1 === strDate2) return strDate1;

    // month
    let mon1 = moment(d1).format('MMM');
    let mon2 = moment(d2).format('MMM');

    // year
    let year1 = moment(d1).format('YYYY');
    let year2 = moment(d2).format('YYYY');

    if (mon1 === mon2) {
      // remove year from 2nd string
      strDate2 = strDate2.replace(mon2 + " ", "");
    }

    if (year1 === year2) {
      // remove year from 1st string
      strDate1 = strDate1.replace(", " + year1, "");
    }

    return strDate1 + '-' + strDate2;
  }

  render() {

    const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
    const parsed = queryString.parse(window.location.search);

    if (!parsed.album && !parsed.keyword) {
      return (<div>No album or keyword defined</div>);
    }

    let images = [];
    let album = null;
    let title = "";
    let strDateDisplay = '';

    if (parsed.keyword) {
      images = this.props.albumStore.searchImages;
      //title = "Search";
      //strDateDisplay = parsed.keyword;
    }
    else {
      if (!this.props.albumStore.albums) {
        return (
          <LoadingOverlay active={true} spinner text=''>
            <InfiniteScroll
              pageStart={0}
              initialLoad={true}
              threshold={250}
              loadMore={this.handleScrollAlbums}
              hasMore={true}
              loader={<div className="loader" key={0}></div>}
            >
              <div style={{ border: '3px solid #fff', padding: '20px', textAlign: 'left' }}>
                Loading albums...
              </div>
            </InfiniteScroll>
          </LoadingOverlay>
        );
      }

      album = this.props.albumStore.albums.find(x => x.id === parsed.album);

      if (!album) {
        return (<div>Invalid album ID</div>);
      }

      if (album.images && album.images.length === 0) {
        return (<div>Server error. Please, reload the page.</div>);
      }

      title = album.title;

      // load current images
      //await async 

      if (album.images && album.images.length !== 0) {
        strDateDisplay = this.GetAlbumDate(
          album.images[0].mediaMetadata.creationTime,
          album.images[album.images.length - 1].mediaMetadata.creationTime);
      }

      images = album.images;
    }

    if (!images) {
      return (
        <LoadingOverlay active={true} spinner text=''>
          <InfiniteScroll
            pageStart={0}
            initialLoad={true}
            threshold={250}
            loadMore={this.handleScrollImages}
            hasMore={true}
            loader={<div className="loader" key={0}></div>}
          >

            {parsed.keyword ?
              <SearchForm /> :
              <div>
                <span key={'span-1'} className="m-2" style={{ fontSize: '34px' }}>{title}</span>
                <span key={'span-2'} style={{ color: '#5F6368', marginLeft: '2px' }}>{strDateDisplay}</span>
                <span key={'span-3'} style={{ whiteSpace: 'nowrap' }}>Loading {album ? album.mediaItemsCount : ""} {album.mediaItemsCount > 1 ? "images..." : "image..."}</span>
              </div>
            }
            <div style={{ marginLeft: "8px" }}>

            </div>

          </InfiniteScroll>

        </LoadingOverlay>
      )
    }

    console.log("render::showing", album.images ? album.images.length : "empty", "of", album.mediaItemsCount,);

    // return only images for safari
    if (isSafari) {
      images = images.filter(x => x.mimeType.startsWith('image/'));
    }

    return (
      <div>
        <InfiniteScroll
          pageStart={0}
          initialLoad={false}
          threshold={250}
          loadMore={this.handleScrollImages}
          hasMore={album.mediaItemsCount > album.images.length}
          loader={<div className="loader" key={0}>Loading ...</div>}
        >
          <div>
            <span key={'span-1'} className="m-2" style={{ fontSize: '34px' }}>{title}</span>
            <span key={'span-2'} style={{ color: '#5F6368', marginLeft: '2px', whiteSpace: 'nowrap' }}>{strDateDisplay}</span>
          </div>

          {images.map(item => (
            item.mimeType.startsWith('image/') ?
              <div key={item.id + '-div'} style={{ position: 'relative', height: '200px', margin: '4px', overflow: 'hidden', display: 'inline-block' }}>
                <Link to={parsed.album ?
                  "/carousel?album=" + parsed.album + "&image=" + item.imageId :
                  "/carousel?keyword=" + parsed.keyword + "&image=" + item.imageId
                }>
                  <img className="" key={item.id + '-img'} src={item.baseUrl} style={{ height: '200px' }} />
                </Link>
              </div>
              :
              <div key={item.id + '-div'} style={{ position: 'relative', height: '200px', margin: '4px', overflow: 'hidden', display: 'inline-block' }}>
                <video key={item.id + '-vid'} src={item.baseUrl + '=dv'} type={item.mimeType} controls muted autoPlay playsInline poster="true"
                  style={{ height: '200px', padding: '2px', width: 'auto', backgroundColor: '#666' }} />
              </div>

          ))}

        </InfiniteScroll>
      </div>
    );
  }
}

export default AlbumDetails;
