import React, { Component } from 'react';

class CarouselPhotos extends Component {

  state = {
    photos: []
  }

  async componentDidMount() {

    // console.log(albumId);

    let photos = await getSearch();

    console.log('filtering images only');
    photos = photos.filter(x => x.mimeType && x.mimeType.startsWith('image/'));

    for (let i = 0; i < photos.length; i++) {
      if (photos[i].id === this.props.match.params.imageId) {
        photos[i].isActive = 1;
      }
      else {
        photos[i].isActive = 0;
      }
    }

    this.setState({ photos });
  }

  render() {
    let photos = this.props.photos;

    return (
      <div >

        <div style={{
          backgroundColor: 'black',
        }} id="carouselExampleControls" className="carousel slide" data-ride="carousel">

          <div className="carousel-inner" style={{
            backgroundColor: 'red',
          }}
          >
            {photos.map(item =>
              <div className={item.isActive ? "carousel-item active" : "carousel-item"}
                style={{
                  backgroundColor: 'black',

                  border: 'solid 1px #000'
                }}
              >
                {item.mimeType.startsWith('image/') ?
                  <img style={{
                    height: '500px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    display: 'block'
                  }} key={item.id} className="d-block w-800" src={item.baseUrl} alt="First slide" /> :
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
      </div>
    );
  }
}

export default CarouselPhotos;
// <AliceCarousel mouseTracking items={this.items} />
//<video src={item.baseUrl + '=dv'} type={item.mimeType} controls style={{height:'200px', padding:'1.051%', width: 'auto', backgroundColor:'#666'}}/>