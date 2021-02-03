import { observable, action, computed } from 'mobx';
import { getAlbums } from '../services/googleService';

export default class AlbumStore {
  constructor() {
  }

  @observable albums = [];
  @action async getAllAlbums() {
    this.albums = await getAlbums();
    console.log('Albums length =', this.albums.length);
  }

}
