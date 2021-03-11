//import { observable, action } from 'mobx';
import { getAlbums, getAlbum, getSearch } from '../services/googleService';
import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';
import { useContext } from 'react';

class AlbumStore {
  albums = null;
  currentAlbum = null;
  searchImages = null;
  searchImagesPageToken = null;

  constructor() {
    makeAutoObservable(this);
  }

  async cacheAlbums() {

    this.currentAlbum = null;

    if (!this.albums) {

      let albums = await getAlbums();

      if (albums) {
        albums.sort((a, b) => new Date(b.creationTime) - new Date(a.creationTime));
        this.albums = albums;
      }
      else {
        this.albums = [];
      }

    }
  }

  async cacheAlbumImages(albumId) {

    // todo: check albums for null
    if (!this.albums) {
      console.log("getting albums...")
      await this.cacheAlbums();
    }

    const album = this.albums.find(x => x.id === albumId);

    this.currentAlbum = { id: albumId, name: album.title };

    if (!album.images || album.pageToken) {
      let data = await getAlbum(albumId, album.pageToken);
      if (data) {
        album.pageToken = data.nextPageToken;
        album.images = album.images ? [...album.images, ...data.photos] : data.photos;
      }
      else {
        album.images = [];
        album.pageToken = null;
      }
    }
    else {
      //console.log("not getting album");
    }
  }

  async cacheAlbumImagesAll(albumId) {

    // todo: check albums for null
    if (!this.albums) {
      console.log("getting albums...")
      await this.cacheAlbums();
    }

    const album = this.albums.find(x => x.id === albumId);

    // do nothing if all pictures are loaded
    if (album.images && !album.pageToken) {

    }
    else {
      do {
        let data = await getAlbum(albumId, album.pageToken);
        album.pageToken = data.nextPageToken;
        album.images = album.images ? [...album.images, ...data.photos] : data.photos;
      }
      while (album.pageToken);
    }

    this.currentAlbum = { id: albumId, name: album.title };
  }

  async cacheSearchImages(keyword) {

    let images = this.searchImages;

    if (!images || (images && this.searchImagesPageToken)) {
      let data = await getSearch(keyword, images ? this.searchImagesPageToken : null);
      if (data) {
        images = images ? [...images, ...data.photos] : data.photos;

        this.searchImagesPageToken = data.nextPageToken;
        this.searchImages = images;
      }
      else {
        //todo
        console.log("debug!");
        images = [];
        images.pageToken = null;
      }
    }
    else {
      console.log("search. album is full");
    }
  }


  async cacheSearchImagesAll(keyword) {

    let images = this.searchImages;

    // do nothing if all pictures are loaded
    if (images && !this.searchImagesPageToken) {

    }
    else {
      do {
        let data = await getSearch(keyword, images ? this.searchImagesPageToken : null);
        if (data) {
          images = images ? [...images, ...data.photos] : data.photos;

          this.searchImagesPageToken = data.nextPageToken;
          this.searchImages = images;
        }
        else {
          //todo
          console.log("debug!");
          images = [];
          images.pageToken = null;
        }
      }
      while (this.searchImagesPageToken);
    }
  }
}

const StoreContext = createContext();

function StoreProvider ({store, children}) {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

const useStore = () => {
  return useContext(StoreContext);
}

export { AlbumStore, StoreProvider, useStore }