import React, { Component } from 'react';
import { getAlbums } from '../services/googleService';
import { Link } from 'react-router-dom';
import Album from './album';

class Albums extends Component {
  state = {
    albums: []
  }

  async componentDidMount() {
    let albums = await getAlbums();
    //console.log('COMING VALUE', tweets);

    albums = albums.filter(album => album.title);

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

    this.setState({ albums });

  }

  render() {
    return (
      // <div style={{display: 'flex', justifyContent: "space-around"}}>
      <div style={{}}>

        {this.state.albums.map(item =>
          <Album key={item.id} albumId={item.id} albumTitle={item.title} coverUrl={item.coverPhotoBaseUrl}>{item.title}</Album>
        )}
      </div>
    );
  }
}

export default Albums;

// <Album key={item.id} to='/album' albumTitle={item.title} albumId={item.id} cover={item.coverPhotoBaseUrl} />