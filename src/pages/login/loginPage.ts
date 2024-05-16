import { createCustomer, CustomerData } from '../../api/customer';
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
      console.log('Submit button is clicked');
      e.preventDefault();
      showLoading();
      const emailInput = document.getElementById('email') as HTMLInputElement | null;
      const passwordInput = document.getElementById('password') as HTMLInputElement | null;
      if (emailInput && passwordInput) {
        const email = emailInput.value;
        const password = passwordInput.value;
        const customerData: CustomerData = {
          email,
          password,
          firstName: '',
          lastName: '',
          key: '',
          countryCode: '',
        };
        console.log(customerData);
        try {
          // Создание нового пользователя
          const newUser = await createCustomer(customerData);

          hideLoading();
          if (typeof newUser === 'object') {
            const user: User = {
              name: `${customerData.firstName} ${customerData.lastName}`,
              email: customerData.email,
            };
            setUserInfo(user);
            // redirectUser();
          } else {
            showMessage('An error occurred while creating the customer.');
          }
        } catch (error) {
          console.error(error);
          showMessage('An error occurred while creating the customer.');
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
                                <div class="mb-3 form-floating" >
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
