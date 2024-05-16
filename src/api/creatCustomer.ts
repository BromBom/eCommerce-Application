import RegProfile from '../app/pages/registration/form/profile/profile';

export default async function creatCustomer(profile: RegProfile) {
  const url = 'https://api.europe-west1.gcp.commercetools.com/jsfe2023q4shop/customers';
  const data = {
    email: profile.inputEmail.element.value,
    password: profile.inputPassword.element.value,
    firstName: profile.inputName.element.value,
    lastName: profile.inputLastName.element.value,
    dateOfBirth: profile.inputDate.element.value,
  };
  const headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer 3CBluAJX0mLF8IzrvTxcMadRZZmdYYGp',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers,
    });
    const json = await response.json();
    const objCustomer = JSON.stringify(json);
    console.log('Успех:', objCustomer);
    // localStorage.setItem('registeredCustomer', objCustomer.customer);
  } catch (error) {
    console.error('Ошибка:', (error as Error).message);
  }
}
