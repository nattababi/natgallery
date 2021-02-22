import React, { Component } from 'react';
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
      await this.props.albumStore.cacheAlbumImagesAll(parsed.album);
    }
    else if (parsed.keyword) {
      await this.props.albumStore.cacheSearchImages(parsed.keyword);
    };

    //window.addEventListener("keyup", function(e){ if(e.key === 27) console.log('esc'); }, false);
  }

  render() {
    const parsed = queryString.parse(window.location.search);

    if (!parsed.album && !parsed.keyword) return (<div>No album or keyword defined</div>);

    if (parsed.album && ((!this.props.albumStore.albums) || (this.props.albumStore.albums.images))) {
      return (
        <LoadingOverlay
          active={true}
          spinner
          text=''
        >
          <div style={{ border: '3px solid #fff', padding: '20px', textAlign: 'left' }}>
            Loading albums...
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
        <div style={{ border: '3px solid #fff', padding: '20px', textAlign: 'left' }}>
          Loading images...
          </div>
      </LoadingOverlay>
    }

    if (images && images.count === 0) {
      return (<div>No images found</div>);
    }

    //TODO: why this happens??
    let isfound = -1;
    for(let i = 0; i<images.length;++i){
      if (images[i].imageId === parsed.image){
        isfound = i;
      }
    }
    //if (isfound === -1) parsed.image = images[0].id;
    console.log("isfound index", isfound);
    //http://localhost:3000/carousel?album=AAcw7hacKXsgViYFHv-9bhwKxsfJZlE7Sqj_h_C32uXQdUiVM4nStwVo5h1nrcEKKAE9FS1YbK1F&image=AAcw7haQDWnevilgD1oZY94hjVv7x4WzuStooezqCSdMQzSBm3bXKQwLrmYq10P8tlQMp6sdqXfWEfyFdQFmDZsJ_BDwFdHGaA
    
    //images = images.filter(x => x.mimeType && x.mimeType.startsWith('image/'));

    // for (let i = 0; i< images.length;i++){
    //   if (!images[i].mimeType.startsWith('image/')) console.log(images[i].baseUrl);
    // }

    return (
      <div style={{ backgroundColor: 'black' }} id="carouselExampleControls" className="carousel slide" data-ride="carousel" data-interval="5000" data-wrap="false" keyboard="true" ride="true">
    
       <div className="carousel-inner" style={{
          backgroundColor: 'white',
        }}
        >
          {images.map((item, index, arrayobj) =>
            <div key={item.id + '-wrap'} className={
              (parsed.image && item.imageId === parsed.image) ? "carousel-item active" : "carousel-item" }
              style={{
                backgroundColor: 'black',
                border: 'solid 1px #000'
              }}
            >
              {item.mimeType.startsWith('image/') ?
                <div style={{ position: 'relative', textAlign: 'center', }}>
                  <img style={{ maxWidth:'100%', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
                    key={item.id} className="d-block w-800"
                    src={item.baseUrl + '=w' + item.mediaMetadata.width + '-h' + item.mediaMetadata.height}
                    alt="Alt slide" />
                </div> : 
                <div style={{ position: 'relative', textAlign: 'center', }}>
                  <video style={{ maxWidth:'100%', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
                    key={item.id} className="d-block w-800"
                    src={item.baseUrl+"=dv"} type={item.mimeType} controls
                    alt="Alt slide" />
                </div>
                  


              }
              <div style={{ margin: '4px 4px 4px 4px' }} style={{ position: 'absolute', bottom: '0', background: 'rgba(0, 0, 0, 0.5)', color: '#f1f1f1', width: '100%', height: '70px', padding: '18px' }}>
              </div>
              <div style={{ position: 'absolute', bottom: '35px', left: '50%', fontSize: '12px', color: '#F0F0F2' }}>{index + 1} &#x2f; {arrayobj.length}</div>
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

// src={item.baseUrl+"=dv"} type={item.mimeType} allowFullScreen