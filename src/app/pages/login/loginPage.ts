import { apiRoot } from '../../../api/BuildClient';
import { setUserInfo } from '../../utils/localstorage';
import { hideLoading, showLoading, showMessage } from '../../utils/showmessage';
import './loginPage.scss';
import Header from '../../components/header/header';
import State from '../../state/state';
import Router from '../../router/router';
import { Pages } from '../../router/pages';

interface User {
  name: string;
  email: string;
}

export function handleError(error: Error, message: string): void {
  console.error(error);
  showMessage(message);
}

const loginPage = {
  after_render: (router: Router, state: State, header: Header): void => {
    const signinForm = document.getElementById('signin-form') as HTMLFormElement | null;
    const emailInput = document.getElementById('email') as HTMLInputElement | null;
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;
    const checkPassword = document.getElementById('checkPassword') as HTMLInputElement | null;

    if (signinForm && emailInput && passwordInput) {
      emailInput.addEventListener('input', () => {
        const email = emailInput.value.trim();
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$/;
        if (!emailRegex.test(email)) {
          emailInput.setCustomValidity('Please enter a valid email address.');
        } else {
          emailInput.setCustomValidity('');
        }
        emailInput.reportValidity();
      });

      passwordInput.addEventListener('input', () => {
        const password = passwordInput.value.trim();
        const passwordLengthOk = password.length >= 8;
        const containsUpperCase = /[A-Z]/.test(password);
        const containsLowerCase = /[a-z]/.test(password);
        const containsNumber = /[0-9]/.test(password);

        let errorMessage = '';
        if (!passwordLengthOk) {
          errorMessage += 'Password must be at least 8 characters long. ';
        }
        if (!containsUpperCase) {
          errorMessage += 'Password must contain at least one uppercase letter. ';
        }
        if (!containsLowerCase) {
          errorMessage += 'Password must contain at least one lowercase letter. ';
        }
        if (!containsNumber) {
          errorMessage += 'Password must contain at least one number. ';
        }

        passwordInput.setCustomValidity(errorMessage);
        passwordInput.reportValidity();
      });

      signinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Submit button is clicked');

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (emailInput.validity.valid && passwordInput.validity.valid) {
          showLoading();
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
            console.log(response);

            localStorage.setItem('newCustomer', JSON.stringify(response.body.customer));

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

            localStorage.setItem('newCustomer', JSON.stringify(data.customer));
            localStorage.setItem('userID', JSON.stringify(data.customer));

            header.configureView();

            router.navigate(Pages.PRODUCT);
          } catch (error) {
            hideLoading();
            if (error instanceof Error) {
              handleError(error, error.message);
            } else {
              console.error(error);
              handleError(new Error('Invalid form data'), 'Please enter both email and password.');
            }
          }
        } else {
          handleError(new Error('Invalid form data'), 'Please enter valid email and password.');
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
    return `
      <div>
        <div class="modal-dialog modal-dialog-centered">
          <div class="login-modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="loginLabel">Login</h5>
            </div>
            <div class="modal-body">
              <form id="signin-form">
                <div class="mb-3 form-floating">
                  <input type="email" class="form-control" name="email" id="email" aria-describedby="emailHelp" placeholder="Email" required>
                  <div id="emailHelp" class="form-text">example@email.com</div>
                </div>
                <div class="mb-3 form-floating">
                  <input type="password" class="form-control" name="password" id="password" placeholder="Password" required>
                  <div id="passwordHelp" class="form-text">Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number</div>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="FakePSW" id="checkPassword">
                  <label class="form-check-label" for="checkPassword">Show Password</label>
                </div>
                <div id="error-container" class="alert alert-danger" style="display: none;"></div>
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
