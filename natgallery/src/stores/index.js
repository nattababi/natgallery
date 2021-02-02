import { autorun } from 'mobx';

import AlbumStore from './albumStore';
import ImageStore from './imageStore';

const albumStore = new AlbumStore();
const imageStore = new ImageStore();

autorun(() => {
  console.log('SETTING new user =>>::', userStore.user);
})

export { albumStore, imageStore };