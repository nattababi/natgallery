import { observable, action } from 'mobx';
import { getAlbums, getAlbum, getSearch } from '../services/googleService';

export default class AlbumStore {
  @observable albums = null;
  @observable searchImages = null;

  @action async cacheAlbums() {
    if (!this.albums) {
      
      let albums = await getAlbums();
      
      if (albums){
        albums.sort((a, b) => new Date(b.creationTime) - new Date(a.creationTime));
        this.albums = albums;
      }
      else{
        this.albums = [];
      }

    }
  }

  @action async cacheAlbumImages(albumId) {
    
    // todo: check albums for null
    if (!this.albums) {
      console.log("getting albums...")
      await this.cacheAlbums();
    }
    const album = this.albums.find(x => x.id === albumId);
    
    if (!album.images || album.pageToken){
      let data = await getAlbum(albumId, album.pageToken);
      if (data){
        album.pageToken = data.nextPageToken;
        album.images = album.images ? [...album.images, ...data.photos] : data.photos;
      }
      else{
        album.images = [];
        album.pageToken = null;
      }
    }
    else{
      //console.log("not getting album");
    }
  }

  @action async cacheSearchImages(keyword) {
    this.searchImages = await getSearch(keyword);
    //console.log("Search images length=", this.searchImages.length);
  }
}
