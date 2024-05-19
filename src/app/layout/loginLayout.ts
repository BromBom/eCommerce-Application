import Layout from './layout';
import loginPage from '../pages/login/loginPage';

class LoginPageLayout extends Layout {
  constructor() {
    super({ tag: 'div', classNames: ['login-page'] });
    this.initLoginPage();
  }

  private initLoginPage() {
    const element = this.viewElementCreator.getElement();
    if (element) {
      element.innerHTML = loginPage.render();
      setTimeout(() => {
        loginPage.after_render();
      }, 0);
    } else {
      console.error('Failed to initialize login page: view element is null');
    }
  }
}

export default LoginPageLayout;
