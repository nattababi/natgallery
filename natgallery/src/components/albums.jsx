import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Album from './album';
import { inject, observer } from 'mobx-react';

@inject('albumStore')
@observer
class Albums extends Component {
  async componentDidMount() {
    await this.props.albumStore.getAllAlbums();

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
    console.log(this.props.albumStore.albums.length);

    return (
      // <div style={{display: 'flex', justifyContent: "space-around"}}>
      <div style={{}}>

        {this.props.albumStore.albums.map(item =>
          <Album key={item.id} albumId={item.id} albumTitle={item.title} coverUrl={item.coverPhotoBaseUrl}>{item.title}</Album>
        )}
      </div>
    );
  }
}

export default Albums;

// <Album key={item.id} to='/album' albumTitle={item.title} albumId={item.id} cover={item.coverPhotoBaseUrl} />