import React, { Component } from 'react';
import queryString from 'query-string';
import { inject, observer } from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';

import SwiperCore, { Thumbs, Controller, Autoplay, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import styles from './carousel.module.css';

SwiperCore.use([Thumbs]);
//SwiperCore.use([Controller]);
SwiperCore.use([Autoplay]);
SwiperCore.use([Navigation]);

@inject('albumStore')
@observer
class Carousel extends Component {
  state = {
    thumbsSwiper: null, 
    controlledSwiper: null,
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

    if (parsed.album && ((! this.props.albumStore.albums) || (this.props.albumStore.albums.images))){
      return (
        <LoadingOverlay
          active={true}
          spinner
          text=''
        >
          <div style={{border: '3px solid #fff', padding: '20px', textAlign: 'left'}}>
          Loading albums...
          </div>
        </LoadingOverlay>
      );
    }
    
    let images = null;
    if (parsed.album){
      const album = this.props.albumStore.albums.find(x => x.id === parsed.album);

      if (!album) return (<div>Invalid album ID</div>);

      images = album.images;
    }
    
    if (parsed.keyword){
      images = this.props.albumStore.searchImages;
    }
    else{
    
    }

    if (!images){
      return <LoadingOverlay
          active={true}
          spinner
          text=''
        >
          <div style={{border: '3px solid #fff', padding: '20px', textAlign: 'left'}}>
          Loading images...
          </div>
        </LoadingOverlay>
    }
    
    if (images && images.count === 0){
      return (<div>No images found</div>);
    }

    //TODO: process videos

    // return only images for safari
    if (isSafari) {
      images = images.filter(x => x.mimeType.startsWith('image/'));
    }

    return (

      <div>

        <Swiper key='swiper-1' style={{display: 'grid', width: '100%', background: 'black', marginTop: 'auto', marginBottom: 'auto', marginRight: 'auto', marginLeft: 'auto'}}
          
          thumbs={{ swiper: this.state.thumbsSwiper }}
          //controller={{ control: this.state.controlledSwiper }}
          //onSwiper={(swiper) => console.log("::OnSwiper event", swiper)}

          initialSlide={images.findIndex( (elem) => elem.id === parsed.image)}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={false}
          navigation
          >
        
          {images.map(item=>
            <SwiperSlide key={item.id + "-slide"} style={{display: 'grid', width: '100%', background: 'white', marginTop: 'auto', marginBottom: 'auto', marginRight: 'auto', marginLeft: 'auto'}}>
              {
                item.mimeType.startsWith('image/')?
                  <img key={item.id} 
                    src={item.baseUrl + '=w' + item.mediaMetadata.width + '-h' + item.mediaMetadata.height}
                    style={{ margin: 'auto', maxWidth: '100%', maxHeight: '80vh', background:'white'}}
                    alt="Alt slide"/>
                :
                <video key={item.id + '-vid'} src={item.baseUrl + '=dv'} type={item.mimeType} controls playsInline
                style={{ margin: 'auto', maxWidth: '100%', maxHeight: '80vh', background:'white'}} />
              }
            </SwiperSlide>)}
        
        </Swiper>


        <Swiper key='swiper-2' style={{background: 'white', width: 'auto'}}

          //onSwiper={this.setControlledSwiper}

          onSwiper={this.setThumbsSwiper}
          watchSlidesVisibility
          watchSlidesProgress

          spaceBetween={20}
          centeredSlides={true}
          navigation
          slidesPerView={'auto'}
          // // pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          //onSlideChange={(p1) => console.log('slide lower change', p1)}

          >
          {images.map(item=>
            
            <SwiperSlide key={item.id + "-thum"} tag="ul" style={{ marginTop: "0.5rem", marginBottom: "1rem", padding: 0, flexShrink: "unset", width: 'auto' }}>
              <img key={item.id + "-thum-img"} 
                src={item.baseUrl + '=w' + item.mediaMetadata.width + '-h' + item.mediaMetadata.height}
                style={{ height: '150px', width: 'auto' }}
                alt="Alt slide"
                />
            </SwiperSlide>
            
            )
          }
        </Swiper>

      </div>

    );
  }
}

export default Carousel;

