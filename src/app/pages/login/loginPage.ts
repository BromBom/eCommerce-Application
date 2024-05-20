import { apiRoot } from '../../../api/BuildClient';
import { getUserInfo, setUserInfo } from '../../utils/localstorage';
import { hideLoading, showLoading, showMessage } from '../../utils/showmessage';
import './loginPage.scss';
import Header from '../../components/header/header';
import State from '../../state/state';
import Router from '../../router/router';

interface User {
  name: string;
  email: string;
}

function handleError(error: Error, message: string): void {
  console.error(error);
  showMessage(message);
}

const loginPage = {
  after_render: (router: Router, state: State, header: Header): void => {
    console.log('after_render function is called');
    const signinForm = document.getElementById('signin-form');
    const checkPassword = document.getElementById('checkPassword');
    if (signinForm) {
      signinForm.addEventListener('submit', async (e) => {
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
              handleError(new Error('Login failed'), 'An error occurred during login.');
              return;
            }

            const data = response.body;
            console.log('Response received:', data);

            const user: User = {
              name: `${data.customer.firstName} ${data.customer.lastName}`,
              email: data.customer.email,
            };
            setUserInfo(user);

            state.saveUser(user);

            header.configureView();

            router.navigate('/');
          } catch (error) {
            if (error instanceof Error) {
              handleError(error, 'An error occurred while logging in.');
            } else {
              console.error(error);
              handleError(new Error('Invalid form data'), 'Please enter both email and password.');
            }
          }
        } else {
          handleError(new Error('Invalid form data'), 'Please enter both email and password.');
        }
      });
    } else {
      handleError(new Error('Signin form not found'), 'Signin form element not found');
    }

    if (checkPassword) {
      checkPassword.addEventListener('click', () => {
        const passwordCheck = document.getElementById('password') as HTMLInputElement | null;
        if (passwordCheck) {
          passwordCheck.type = passwordCheck.type === 'password' ? 'text' : 'password';
        } else {
          handleError(new Error('Password input not found'), 'Password input element not found');
        }
      });
    } else {
      handleError(new Error('Check password element not found'), 'Check password element not found');
    }
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
                  <input type="email" class="form-control" name="email" id="email" aria-described by="emailHelp" placeholder="Email" required>
                  <div id="emailHelp" class="form-text">example@email.com</div>
                </div>
                <div class="mb-3 form-floating">
                  <input type="password" class="form-control" name="password" id="password" placeholder="Password" required>
                  <div id="emailHelp" class="form-text">Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number</div>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="FakePSW" id="checkPassword">
                  <label class="form-check-label" for="checkPassword">Show Password</label>
                </div>
                <button type="submit" class="btn btn-primary mt-3">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  },
};

export default loginPage;
