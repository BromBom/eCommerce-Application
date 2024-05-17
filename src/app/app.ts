import Registration from './pages/registration/index';
import loginPage from './pages/login/loginPage';

export default class App {
  root: HTMLDivElement;

  Registration: Registration;

  LoginPage: HTMLElement;

  constructor() {
    this.Registration = new Registration();
    this.root = App.init();
    this.LoginPage = this.createLoginPage();
  }

  private static init(): HTMLDivElement {
    const element = document.createElement('div');
    element.classList.add('root');
    return element;
  }

  private createLoginPage(): HTMLElement {
    const loginContainer = document.createElement('div');
    loginContainer.innerHTML = loginPage.render();
    this.root.append(loginContainer.firstElementChild as HTMLElement);
    return loginContainer.firstElementChild as HTMLElement;
  }

  render(): void {
    document.body.append(this.root);
    this.root.append(this.Registration.getElement());
    this.root.append(this.LoginPage);
  }
}
