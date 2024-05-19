const KEY_FOR_SAVE_TO_LOCALSTORAGE = 'exampleSpaApp';

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
    const fiedlsObject = Object.fromEntries(this.fields.entries());
    localStorage.setItem(KEY_FOR_SAVE_TO_LOCALSTORAGE, JSON.stringify(fiedlsObject));
  }

  loadState() {
    const storageItem = localStorage.getItem(KEY_FOR_SAVE_TO_LOCALSTORAGE);
    if (storageItem) {
      const fieldObject = JSON.parse(storageItem);

      this.fields = new Map(Object.entries(fieldObject));
      return this.fields;
    }
    return new Map();
  }
}
