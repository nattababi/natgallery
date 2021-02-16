import React, { Component } from 'react';
import Album from './album';
import { inject, observer } from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';

@inject('albumStore')
@observer
class Albums extends Component {
  async componentDidMount() {
    await this.props.albumStore.cacheAlbums();
    //albums = albums.filter(album => album.title);

    // console.log('before sorting-1');
    // sort by mediaMetadata.creationTime
    //   albums.sort((a, b) => {
    //     let fa = a.title.toLowerCase(),
    //         fb = b.title.toLowerCase();

    //     if (fa < fb) {
    //         return -1;
    //     }
    //     if (fa > fb) {
    //         return 1;
    //     }
    //     return 0;
    // });
    // console.log('after sorting');

    //this.setState({ albums });

  }

  render() {
    if (!this.props.albumStore.albums) {
      return (
        <div>
          <LoadingOverlay
            active={true}
            spinner
            text=''
            >
            <div style={{border: '3px solid #fff', padding: '20px', textAlign: 'left'}}>
              Loading albums...
            </div>
          </LoadingOverlay>
        </div>);
    }

    if (this.props.albumStore.albums.length < 1) {
      return (<div>Server error or no albums found. Please, refresh the page</div>);
    }

    return (
      // <div style={{display: 'flex', justifyContent: "space-around"}}>
      <div style={{}}>

        {this.props.albumStore.albums.map(item =>
          <Album key={item.id}
            albumId={item.id}
            albumTitle={item.title}
            coverUrl={item.coverPhotoBaseUrl}
            mediaItemsCount={item.mediaItemsCount}/>
        )}
      </div>
    );
  }
}

export default Albums;

// <Album key={item.id} to='/album' albumTitle={item.title} albumId={item.id} cover={item.coverPhotoBaseUrl} />