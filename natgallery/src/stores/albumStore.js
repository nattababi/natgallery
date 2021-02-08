import { observable, action } from 'mobx';
import { getAlbums, getAlbum, getSearch } from '../services/googleService';

export default class AlbumStore {
  constructor() {

  }

  @observable albums = null;

  @action async cacheAlbums() {
    if (!this.albums) {
      this.albums = await getAlbums();
    }
    //console.log('albumStore::Albums length =', this.albums.length);
  }

  @action async cacheAlbumImages( albumId ) {
    // todo: check albums for null

    if (!this.albums){
      await this.cacheAlbums();
      console.log("store:albums loaded", this.albums.length);
    }

    const album = this.albums.find(x => x.id === albumId);
    console.log("store:load images to", album);
    album.images = await getAlbum(albumId);
    
  }
}
