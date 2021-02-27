import React, { Component } from 'react';
import queryString from 'query-string';
import { inject, observer } from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';

import SwiperCore, { Thumbs, Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';

SwiperCore.use([Thumbs, Autoplay, Navigation]);

@inject('albumStore')
@observer
class Carousel extends Component {
  state = {
    thumbsSwiper: null, 
  }

  setThumbsSwiper = (p1) => {
    this.setState({thumbsSwiper : p1});
  }

  async componentDidMount() {
    const parsed = queryString.parse(window.location.search);

    if (parsed.album) {
      //search by album
      await this.props.albumStore.cacheAlbumImagesAll(parsed.album);
    }
    else if (parsed.keyword) {
      await this.props.albumStore.cacheSearchImages(parsed.keyword);
    };

  }

  render() {

    //const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const parsed = queryString.parse(window.location.search);
    const isSafari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);
    
    if (!parsed.album && !parsed.keyword) return (<div>No album or keyword defined</div>);

    if (parsed.album && ((!this.props.albumStore.albums) || (this.props.albumStore.albums.images))){
      return (
        <LoadingOverlay
          active={true}
          spinner
          text=''
        >
          <div style={{ border: '3px solid #fff', height: '70px', textAlign: 'left' }}>
            <div style={{ marginTop: '18px' }}>
              Loading albums...
            </div>
          </div>
        </LoadingOverlay>
      );
    }
    
    let images = null;
    if (parsed.album) {
      const album = this.props.albumStore.albums.find(x => x.id === parsed.album);

      if (!album) return (<div>Invalid album ID</div>);

      images = album.images;
    }
    
    if (parsed.keyword) {
      images = this.props.albumStore.searchImages;
    }
    else {
    
    }

    if (!images) {
      return <LoadingOverlay
          active={true}
          spinner
          text=''
        >
          <div style={{ border: '3px solid #fff', height: '70px', textAlign: 'left' }}>
          <div style={{marginTop: '18px'}}>
            Loading images...
          </div>
        </div>
        </LoadingOverlay>
    }
    
    if (images && images.count === 0) {
      return (<div>No images found</div>);
    }

    //TODO: process videos

    // return only images for safari
    if (isSafari) {
      images = images.filter(x => x.mimeType.startsWith('image/'));
    }

    console.log("rendering carousel with", images.length, 'images');
    
    return (

      <div>

        <Swiper key='swiper-1'
          style={{ display: 'grid', width: '100%', background: 'black', marginTop: 'auto', marginBottom: 'auto', marginRight: 'auto', marginLeft: 'auto' }}
          //style={{width: '100%', height: '300px', marginLeft: 'auto', marginRight: 'auto', height: '80%', width: '100%'}}
          thumbs={{ swiper: this.state.thumbsSwiper }}
          // controller={{ control: this.state.controlledSwiper }}
          // onSwiper={(swiper) => console.log("::OnSwiper event", swiper)}
          effect={'fade'}
          initialSlide={images.findIndex((elem) => elem.id === parsed.image)}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={false}
          navigation
          >
        
          {images.map(item =>
            
            <SwiperSlide key={item.id + "-slide"}
              //style={{backgroundSize: 'cover', backgroundPosition: 'center'}}
              style={{ display: 'grid', width: '100%', background: 'black', marginTop: 'auto', marginBottom: 'auto', marginRight: 'auto', marginLeft: 'auto' }}
              //style={{backgroundSize: 'cover', backgroundPosition: 'center'}}
              >
              {
                item.mimeType.startsWith('image/') ?
                <img key={item.id} 
                  src={item.baseUrl + '=w' + item.mediaMetadata.width + '-h' + item.mediaMetadata.height}
                  style={{ margin: 'auto', maxWidth: '100%', maxHeight: '80vh', background: 'white' }}
                    alt="Alt slide" />
                :
                <video key={item.id + '-vid'} src={item.baseUrl + '=dv'} type={item.mimeType} controls playsInline
                  style={{ margin: 'auto', maxWidth: '100%', maxHeight: '80vh', background: 'white' }} />
              }
            </SwiperSlide>)}
        
        </Swiper>


        <Swiper key='swiper-2'
          style={{height: '20%', boxSizing: 'border-box', padding: '10px 0'}}
          //style={{ background: 'white', width: 'auto' }}
          //onSwiper={this.setControlledSwiper}
          onSwiper={this.setThumbsSwiper}
          watchSlidesVisibility
          swatchSlidesProgress
          
          spaceBetween={5}
          centeredSlides={true}
          navigation

          slidesPerView={4} 
          //scrollbar={{ draggable: true }}
          //onSlideChange={(p1) => console.log('slide lower change', p1)}
          >
          {images.map(item =>
            
            <SwiperSlide key={item.id + "-thum"}
              style={{backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: '0% 20%', height: '100px', width: '65px', backgroundImage:'url(' + item.baseUrl + '=w' + item.mediaMetadata.width + '-h' + item.mediaMetadata.height + ')'}}
              //style={{marginTop: "0.5rem", width: 'auto', flexShrink: "unset", padding: 0}}
              //style={{  marginBottom: "1rem", padding: 0, flexShrink: "unset", width: 'auto' }}
              >
            </SwiperSlide>
            
            )
          }
        </Swiper>

      </div>

    );
  }
}

export default Carousel;

