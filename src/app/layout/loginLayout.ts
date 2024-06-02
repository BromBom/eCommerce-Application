import Layout from './layout';
import loginPage from '../pages/login/loginPage';
import Header from '../components/header/header';
import State from '../state/state';
import Router from '../router/router';

class LoginPageLayout extends Layout {
  header: Header;

  state: State;

  router: Router;

  constructor(header: Header, state: State, router: Router) {
    super({ tag: 'div', classNames: ['login-page'] });
    this.header = header;
    this.state = state;
    this.router = router;
    this.initLoginPage();
  }

  private initLoginPage() {
    const element = this.viewElementCreator.getElement();
    if (element) {
      element.innerHTML = loginPage.render();
      setTimeout(() => {
        loginPage.after_render(this.router, this.state, this.header);
      }, 0);
    } else {
      console.error('Failed to initialize login page: view element is null');
    }
  }
}

export default LoginPageLayout;
