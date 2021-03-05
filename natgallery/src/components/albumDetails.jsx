import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { inject, observer } from 'mobx-react';
import { GetAlbumDate } from '../tools/main';
//import { OverlayAlbum, OverlayImages } from './overlays';
import LoadingOverlay from 'react-loading-overlay';
import InfiniteScroll from 'react-infinite-scroller';
import SearchForm from './searchForm';


@inject('albumStore')
@observer
class AlbumDetails extends Component {
  title = "";
  albumId = "";

  handleScrollAlbums = async () => {
    console.log('@@handleScrollAlbums');
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

    console.log('@@handleScrollImages');
    const parsed = queryString.parse(window.location.search);

    if (parsed.title) {
      this.title = parsed.title;
    }

    if (parsed.album) {
      //search by album
      console.log("Load album images");
      this.albumId = parsed.album;
      await this.props.albumStore.cacheAlbumImages(this.albumId);
    }
    else if (parsed.keyword) {
      console.log("Load search images");
      await this.props.albumStore.cacheSearchImages(parsed.keyword);
    };
  }

  async componentDidMount() {
  }

  

  render() {

    console.log("RENDER");
    
    const parsed = queryString.parse(window.location.search);
    
    if (!parsed.album && !parsed.keyword) {
      return (<div>No album or keyword defined</div>);
    }
    
    const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);

    let images = [];
    let album = null;
    let title = "";
    let strDateDisplay = '';

    if (parsed.keyword) {
      images = this.props.albumStore.searchImages;
      //title = "Search";
      //strDateDisplay = parsed.keyword;
      //console.log(images.length);  
    } 
    else {
      // find album and images
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
        strDateDisplay = GetAlbumDate(
          album.images[0].mediaMetadata.creationTime,
          album.images[album.images.length - 1].mediaMetadata.creationTime);
      }

      images = album.images;
    }

    if (!images) {
      console.log('images are empty. returning handleScrollImages::initialLoad={true}');
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
      );
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

    console.log('images are not empty. returning inf scroll, hasmore=', hasMoreCalc);
    
    // for (let i = 0; i<images.length; i++){
    //   if (images[i].id === "AAcw7haQEmV7MMi-qNhSw03q1U1gkN4PHtYdqJ60CmQg5dEZkM78_qcYB3xSNr-SaIUX9sYIcs7MdMASBC5E09MmRY1HXVe3gw"){
    //     console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!item duplicated', images[i].baseUrl);
    //   }
    // }
    
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
