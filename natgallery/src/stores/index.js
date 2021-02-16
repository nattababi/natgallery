import { autorun } from 'mobx';

import AlbumStore from './albumStore';

const albumStore = new AlbumStore();

autorun(() => {
  //albumStore.cacheAlbums();
})

export { albumStore };