import { autorun } from 'mobx';

import AlbumStore from './albumStore';
import ImageStore from './imageStore';

const albumStore = new AlbumStore();
const imageStore = new ImageStore();

autorun(() => {
  console.log('autorun:: albums =>>::', albumStore.albums.length);
})

export { albumStore, imageStore };