import Registration from './pages/registration';

export default class App {
  root: HTMLDivElement;

  Registration: Registration;

  registrationPage: HTMLDivElement;

  constructor() {
    this.Registration = new Registration();
    this.registrationPage = this.Registration.getElement();
    this.root = this.init();
  }

  private init() {
    const element = document.createElement('div');
    element.classList.add('root');
    return element;
  }

  render() {
    document.body.append(this.root);
    this.root.append(this.registrationPage);
  }
}