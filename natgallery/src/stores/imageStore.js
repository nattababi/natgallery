import { observable, action, computed } from 'mobx';
import auth from '../services/authService';

export default class UserStore {
  constructor() {
    this.user = auth.getCurrentUser();
  }

  @observable user = {};
  @computed get fullName() {
    return this.user ? `${this.user.firstName} ${this.user.lastName}` : ""; 
  };

  @action login({ email, password }) {
    console.log(this);
    auth.login(email, password)
    .then(() => {
      this.user = auth.getCurrentUser();
    });
    console.log('New stored USER =', this.user);
  }

  @action async logout() {
    await auth.logout();
    this.user = null;
    console.log('New stored USER =', this.user);
  }
}
