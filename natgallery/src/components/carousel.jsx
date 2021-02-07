import React, { Component } from 'react';
import { getAlbum } from '../services/googleService';
import queryString from 'query-string';
import { inject, observer } from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';

@inject('albumStore')
@observer
class Carousel extends Component {
  async componentDidMount() {
    const parsed = queryString.parse(window.location.search);

    if (parsed.album) {
      //search by album
      await this.props.albumStore.cacheAlbumImages(parsed.album);
    }
    else if (parsed.keyword) {
      await this.props.imageStore.getSearch(parsed.keyword);
    };

  }

  render() {
    const parsed = queryString.parse(window.location.search);

    if (!parsed.album) return (<div>No album defined</div>);

    if (! this.props.albumStore.albums ){
      return (
        <LoadingOverlay
          active={true}
          spinner
        text=''
        >
          <div style={{border: '3px solid #fff', padding: '20px', textAlign: 'left'}}>
          Reloading albums first...
          </div>
        </LoadingOverlay>
      );
    }

    const album = this.props.albumStore.albums.find(x => x.id === parsed.album);

    if (!album) return (<div>Invalid album ID</div>);

    let images = album.images;

    if (!images) return (<div>No images found</div>);

    console.log('filtering images only');
    images = images.filter(x => x.mimeType && x.mimeType.startsWith('image/'));

    let imageId = "";

    if (parsed.image) {
      imageId = parsed.image;
    }
    else {
      imageId = images[0].id;
    }

    // set active attribure for carousel
    for (let i = 0; i < images.length; i++) {
      if (images[i].id === imageId) {
        images[i].isActive = 1;
      }
      else {
        images[i].isActive = 0;
      }
    }
    
    return (
      <div style={{
        backgroundColor: 'black',
      }} id="carouselExampleControls" className="carousel slide" data-ride="carousel" data-interval="1500" data-wrap="false">

        <ol className="carousel-indicators">{images.map((item, index) => {
          return <li key={item.id + '-' + index} data-target="#carouselExampleIndicators" data-slide-to={index} className={item.isActive ? "active" : ""}></li>;
        })}
        </ol>

        <div className="carousel-inner" style={{
          backgroundColor: 'red',
        }}
        >
          {images.map(item =>
            <div key={item.id + '-div'} className={item.isActive ? "carousel-item active" : "carousel-item"}
              style={{
                backgroundColor: 'black',
                border: 'solid 1px #000'
              }}
            >
              {item.mimeType.startsWith('image/') ?
                <img style={{
                  height: '630px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  display: 'block'
                }} key={item.id} className="d-block w-800" src={item.baseUrl + '=w' + item.mediaMetadata.width + '-h' + item.mediaMetadata.height} alt="First slide" /> :
                <iframe src="https://www.youtube.com/watch?v=NBJ0F1x9d48&list=PL9Dxzvu_wTzMMQ9ip057m5TMJvosVl-N9?autoplay=1" />
              }
            </div>)}
        </div>

        <a style={{ marginLeft: '0px' }} className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>

      </div>
    );
  }
}

export default Carousel;


// item =>
//            <div key={item.id + '-div'} className={item.isActive ? "carousel-item active" : "carousel-item"}
//              style={{
//                backgroundColor: 'black',
//
//                border: 'solid 1px #000'
//              }}
//            >
//              {item.mimeType === 'image/jpeg' ?
//                <img style={{
//                  height: '500px',
//                  marginLeft: 'auto',
//                  marginRight: 'auto',
//                  display: 'block'
//                }} key={item.id} className="d-block w-800" src={item.baseUrl} alt="First slide" /> :
//                <iframe src="https://www.youtube.com/watch?v=NBJ0F1x9d48&list=PL9Dxzvu_wTzMMQ9ip057m5TMJvosVl-N9?autoplay=1" />
//              }
//            </div>




// import React, { Component } from 'react';
// import { getAlbum } from '../services/googleService';
// import CarouselPhotos from './carouselPhotos';

// class Carousel extends Component {
//   state = {
//     photos: []
//   }
//   items = [];
//   isActiveAdded = false;

//   async componentDidMount() {
//     let albumId = this.props.match.params.id;

//     // console.log(albumId);

//     let photos = await getAlbum(albumId);

//     photos = photos.filter(x => x.mimeType && x.mimeType.startsWith('image/'));

//     for (let i = 0; i<photos.length; i++){
//       if (photos[i].id === this.props.match.params.imageId){
//         photos[i].isActive = 1;
//       }
//       else{
//         photos[i].isActive = 0;
//       }
//     }

//     this.setState({ photos });
//   }
//   render() {
//     return (
//       <CarouselPhotos />
//     );
//   }
// }

// export default Carousel;
