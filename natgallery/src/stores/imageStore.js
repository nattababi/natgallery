import { observable, action } from 'mobx';

export default class ImageStore {
  constructor() {
    
  }

  @observable images = {};
  @action getImages({ albumId }) {
  }

}
