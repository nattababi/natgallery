import React, { Component } from 'react';
import Album from './album';
import { inject, observer } from 'mobx-react';
import LoadingOverlay from 'react-loading-overlay';
import InfiniteScroll from 'react-infinite-scroller';

@inject('albumStore')
@observer
class Albums extends Component {

  async componentDidMount() {
    await this.props.albumStore.cacheAlbums();
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
            <div style={{ border: '3px solid #fff', padding: '20px', textAlign: 'left' }}>
              Loading albums...
            </div>
          </LoadingOverlay>
        </div>);
    }

    if (this.props.albumStore.albums.length < 1) {
      return (<div>Server error or no albums found. Please, refresh the page</div>);
    }
    
   
    return (
      <div style={{}}>
        {this.props.albumStore.albums.map(item =>
          <Album key={item.id}
            albumId={item.id}
            albumTitle={item.title}
            coverUrl={item.coverPhotoBaseUrl}
            mediaItemsCount={item.mediaItemsCount}
            saveDate={item.saveDate} />
        )}
      </div>
    );
  }
}

export default Albums;