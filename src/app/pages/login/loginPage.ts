import { apiRoot } from '../../../api/client';
import { getUserInfo, setUserInfo } from '../../utils/localstorage';
import { hideLoading, showLoading, showMessage } from '../../utils/showmessage';
import './loginPage.scss';

interface User {
  name: string;
  email: string;
}

const loginPage = {
  after_render: (): void => {
    console.log('after_render function is called');
    document.getElementById('signin-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Submit button is clicked');
      showLoading();
      const emailInput = document.getElementById('email') as HTMLInputElement | null;
      const passwordInput = document.getElementById('password') as HTMLInputElement | null;
      console.log(emailInput, passwordInput);
      if (emailInput && passwordInput) {
        const email = emailInput.value;
        const password = passwordInput.value;
        console.log(`Email: ${email}, Password: ${password}`);
        try {
          console.log('Sending request to commercetools API...');
          const response = await apiRoot
            .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
            .login()
            .post({
              body: {
                email,
                password,
              },
            })
            .execute();
          console.log('Request sent, waiting for response...');

          hideLoading();

          if (response.statusCode !== 200) {
            throw new Error('An error occurred during login.');
          }

          const data = response.body;
          console.log('Response received:', data);

          const user: User = {
            name: `${data.customer.firstName} ${data.customer.lastName}`,
            email: data.customer.email,
          };
          setUserInfo(user);

          // Перенаправление пользователя или выполнение других действий
          // redirectUser();
        } catch (error) {
          console.error(error);
          showMessage('An error occurred while logging in.');
        }
      }
    });

    const passwordCheck = document.getElementById('password') as HTMLInputElement | null;
    document.getElementById('checkPassword')?.addEventListener('click', () => {
      if (passwordCheck) {
        passwordCheck.type = passwordCheck.type === 'password' ? 'text' : 'password';
      }
    });
  },
  render: (): string => {
    // Если пользователь уже вошел в систему, перенаправляем его на главную страницу
    if (getUserInfo().name) {
      // redirectUser();
    }
    return `
      <div>
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="loginLabel">Login</h5>
            </div>
            <div class="modal-body">
              <form id="signin-form">
                <div class="mb-3 form-floating">
                  <input type="email" class="form-control" name="email" id="email" aria-describedby="emailHelp" placeholder="Email" required>
                  <label for="email" class="form-label">Email</label>
                  <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div class="mb-3 form-floating">
                  <input type="password" class="form-control" name="password" id="password" placeholder="Password" required>
                  <label for="password" class="form-label">Password</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="FakePSW" id="checkPassword">
                  <label class="form-check-label" for="checkPassword">Show Password</label>
                </div>
                <button type="submit" class="btn btn-primary mt-3">Login</button>
                <div class="mt-3">
                  <p>New User? <a href="/#/register">Create Your Account</a></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};

export default loginPage;
