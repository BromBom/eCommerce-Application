import LoginView from './pages/login/loginPage';

const renderScreen = (screen: { render: () => string; after_render?: () => void }): void => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = screen.render();
    if (screen.after_render) {
      screen.after_render();
    }
  }
};

renderScreen(LoginView);
