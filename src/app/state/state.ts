export const KEY_USER_ID = 'userID';

interface User {
  name: string;
  email: string;
}

export default class State {
  fields: Map<string, string>;

  constructor() {
    this.fields = this.loadState();
    window.addEventListener('beforeunload', this.saveState.bind(this));
  }

  setField(name: string, value: string) {
    this.fields.set(name, value);
  }

  getField(name: string) {
    if (this.fields.has(name)) {
      return this.fields.get(name);
    }
    return '';
  }

  saveState() {
    const fieldsObject = Object.fromEntries(this.fields.entries());
    localStorage.setItem(KEY_USER_ID, JSON.stringify(fieldsObject));
  }

  loadState() {
    const storageItem = localStorage.getItem(KEY_USER_ID);
    if (storageItem) {
      const fieldObject = JSON.parse(storageItem);
      this.fields = new Map(Object.entries(fieldObject));
      return this.fields;
    }
    return new Map();
  }

  clearState() {
    this.fields.clear();
    localStorage.clear();
  }

  saveUser(user: User) {
    this.setField('name', user.name);
    this.setField('email', user.email);
    this.saveState();
  }

  loadUser(): User {
    return {
      name: this.getField('name') || '',
      email: this.getField('email') || '',
    };
  }
}
