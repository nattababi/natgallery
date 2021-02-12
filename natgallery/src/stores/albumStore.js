import { observable, action } from 'mobx';
import { getAlbums, getAlbum, getSearch } from '../services/googleService';

export default class AlbumStore {
  constructor() {

  }

  @observable albums = null;
  @observable searchImages = null;

  @action async cacheAlbums() {
    if (!this.albums) {
      
      let albums = await getAlbums();
      
      albums.sort((a, b) => new Date(b.creationTime) - new Date(a.creationTime));

      this.albums = albums;

    }
  }

  @action async cacheAlbumImages(albumId) {
    // todo: check albums for null
    if (!this.albums) {
      await this.cacheAlbums();
    }
    const album = this.albums.find(x => x.id === albumId);
    album.images = await getAlbum(albumId);
  }

  @action async cacheSearchImages(keyword) {
    this.searchImages = await getSearch(keyword);
    //console.log("Search images length=", this.searchImages.length);
  }
}
