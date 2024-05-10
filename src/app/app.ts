import Registration from './pages/registration/registration';

export default class App {
  root: HTMLDivElement;

  Registration: Registration;

  registrationPage: HTMLDivElement;

  constructor() {
    this.Registration = new Registration();
    this.registrationPage = this.Registration.getElement();
    this.root = App.init();
  }

  private static init() {
    const element = document.createElement('div');
    element.classList.add('root');
    return element;
  }

  render() {
    document.body.append(this.root);
    this.root.append(this.registrationPage);
  }
}
