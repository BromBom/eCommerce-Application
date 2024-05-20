import {
  CustomerSignInResult,
  // CustomerUpdateAction,
  CustomerPagedQueryResponse,
  CustomerDraft,
  Customer,
  // CustomerUpdate,
} from '@commercetools/platform-sdk';
import { apiRoot } from './BuildClient';

export const createCustomer = async (customerData: CustomerDraft): Promise<Customer> => {
  try {
    const response = await apiRoot
      .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
      .customers()
      .post({
        body: customerData,
      })
      .execute();

    const signInResult: CustomerSignInResult = response.body;
    console.log('Customer created:', signInResult.customer);
    localStorage.setItem('newCustomer', JSON.stringify(signInResult.customer));
    return signInResult.customer;
  } catch (error) {
    console.error(`Failed to create customer: ${error}`);
    throw new Error(`Failed to create customer: ${error}`);
  }
};

export async function getCustomerByEmail(email: string): Promise<Customer | null> {
  try {
    const response = await apiRoot
      .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
      .customers()
      .get({
        queryArgs: { where: `email="${email}"` },
      })
      .execute();

    const customerToFind: CustomerPagedQueryResponse = response.body;

    if (customerToFind.count === 0) {
      console.log('This email address has not been registered.');
      return null;
    }

    const foundCustomerID: string = customerToFind.results[0].id;
    console.log(`Customer ID found by email: ${foundCustomerID}`);
    return customerToFind.results[0];
  } catch (error) {
    console.error(`Failed to get customer by email: ${error}`);
    throw error;
  }
}
