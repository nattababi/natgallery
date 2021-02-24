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
    //console.log('scroll albums');
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
      console.log("Load part-1 images");
      await this.props.albumStore.cacheSearchImages(parsed.keyword);
    };
  }

  handleScrollImages = async () => {

    //console.log('scroll images');
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
      console.log("Load part-2 images");
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
              <div style={{ border: '3px solid #fff', height: '70px', textAlign: 'left' }}>
                <div style={{marginTop: '18px'}}>
                  Loading albums...
                </div>
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
              <div style={{ border: '3px solid #fff', height: '70px', textAlign: 'left' }}>
                  
                <div style={{backgroundColor:'white'}}> 
                  <div key='div-1' style={{ backgroundColor: 'white', display: 'inline-block', fontSize: '34px', marginLeft: '5px', marginBottom: '-10px' }}>{title}</div>
                  <div key='div-2' style={{ color: '#5F6368', backgroundColor: 'white', display: 'inline-block', marginLeft: '2px', marginTop: '0' }}>{strDateDisplay}</div>
                  <div key='div-3' style={{ color: '#5F6368', backgroundColor: 'white', display: 'inline-block', marginLeft: '8px', marginTop: '0' }}>Loading {album ? album.mediaItemsCount : ""} {album.mediaItemsCount > 1 ? "images..." : "image..."}</div>
                </div>

              </div>
              
              
            }
          </InfiniteScroll>

        </LoadingOverlay>
      )
    }


    if (parsed.album){
      console.log("render::showing", parsed.album && album.images ? album.images.length : "empty", "of", album.mediaItemsCount);
    }
    else if (parsed.keyword) {
      console.log("render::showing", images.length);
    }

    // return only images for safari
    if (isSafari) {
      images = images.filter(x => x.mimeType.startsWith('image/'));
    }

    let hasMoreCalc = false;

    if (parsed.album){
      hasMoreCalc = (album.mediaItemsCount > album.images.length)? true : false;
    }
    else if (parsed.keyword){
      hasMoreCalc = (this.props.albumStore.searchImagesPageToken)? true : false;
    }

    console.log('hasMoreCalc=', hasMoreCalc);
    
    return (
      <div>
        <InfiniteScroll
          pageStart={0}
          initialLoad={false}
          threshold={250}
          loadMore={this.handleScrollImages}
          hasMore={hasMoreCalc}
          loader={<div className="loader" key={0}>Loading ...</div>}
        >
          <div>
            <div key={'div-1'} className="" style={{ backgroundColor: 'white', display: 'inline-block', fontSize: '34px', marginLeft: '5px', marginBottom: '-10px' }}>{title}</div>
            <div key={'div-2'} style={{ backgroundColor: 'white', display: 'inline-block', marginLeft: '10px', marginTop: '0' }}>{strDateDisplay}</div>
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
