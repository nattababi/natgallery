import { observable, action, computed } from 'mobx';

export default class AlbumStore {
  constructor() {
  }

  @observable albums = [];
  @action getAlbums({ email, password }) {
    console.log(this);
    auth.login(email, password)
    .then(() => {
      this.user = auth.getCurrentUser();
    });
    console.log('New stored USER =', this.user);
  }

}
