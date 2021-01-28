import React, { Component } from 'react';
import { getAlbum } from '../services/googleService';
//import CarouselPhotos from './carouselPhotos';
import queryString from 'query-string';

class Carousel extends Component {
  state = {
    photos: []
  }
  items = [];
  isActiveAdded = false;

  async componentDidMount() {

    const parsed = queryString.parse(window.location.search);

    let albumId = "";
    let photos = [];
    let imageId = "";

    if (parsed.album) {
      //search by album
      albumId = parsed.album;
    
      photos = await getAlbum(albumId);
      console.log('filtering images only');
      photos = photos.filter(x => x.mimeType && x.mimeType.startsWith('image/'));

      console.log(photos.length);

      if (parsed.image) {
        imageId = parsed.image;
      }
      
      // console.log("component did mount for album", albumId);
      // console.log("component did mount for image", imageId);

      if (imageId === "" && photos.length > 0){
        imageId = photos[0].id;
      }
      
      for (let i = 0; i < photos.length; i++) {
        if (photos[i].id === imageId) {
          photos[i].isActive = 1;
          console.log("found", i)
        }
        else {
          photos[i].isActive = 0;
        }
      }

    this.setState({ photos });
    }
  }

  render() {
    return (
      <div style={{
        backgroundColor: 'black',
      }} id="carouselExampleControls" className="carousel slide" data-ride="carousel">

        <div className="carousel-inner" style={{
          backgroundColor: 'red',
        }}
        >
          {this.state.photos.map(item =>
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
                }} key={item.id} className="d-block w-800" src={item.baseUrl + '=w'+item.mediaMetadata.width + '-h' + item.mediaMetadata.height} alt="First slide" /> :
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
