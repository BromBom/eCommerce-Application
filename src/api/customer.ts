import {
  CustomerSignInResult,
  // CustomerUpdateAction,
  CustomerPagedQueryResponse,
  CustomerDraft,
  // CustomerUpdate,
} from '@commercetools/platform-sdk';
import { apiRoot } from './client';

interface Customer {
  id: string;
  email?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
}

export interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  key: string;
  countryCode: string;
}

// interface Address {
//   country: string;
// }

const createCustomerDraft = async (customerData: CustomerData): Promise<CustomerDraft> => {
  const { firstName, lastName, email, password, key, countryCode } = customerData;
  return {
    firstName,
    lastName,
    email,
    password,
    key,
    addresses: [
      {
        country: countryCode,
      },
    ],
  };
};

export const createCustomer = async (customerData: CustomerData): Promise<Customer> => {
  try {
    const customerDraft = await createCustomerDraft(customerData);
    const response = await apiRoot
      .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
      .customers()
      .post({
        body: customerDraft,
      })
      .execute();

    const signInResult: CustomerSignInResult = response.body;
    console.log('Customer created:', signInResult.customer);
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

// async function updateCustomerName(customerID: string, firstName: string, lastName: string): Promise<Customer> {
//   const setFirstNameAction: { setFirstName: { firstName: string } } = {
//     setFirstName: { firstName },
//   };

//   const setLastNameAction: { setLastName: { lastName: string } } = {
//     setLastName: { lastName },
//   };

//   const customerUpdate: CustomerUpdate = {
//     version: 1,
//     actions: [setFirstNameAction, setLastNameAction],
//   };

//   try {
//     const response = await apiRoot
//       .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
//       .customers()
//       .withId({ ID: customerID })
//       .post({ body: customerUpdate })
//       .execute();
//     const updatedCustomer: Customer = response.body;
//     console.log(`Updated Customer Name: ${updatedCustomer.firstName} ${updatedCustomer.lastName}`);
//     return updatedCustomer;
//   } catch (error) {
//     console.error(`Failed to update customer name: ${error}`);
//     throw error;
//   }
// }
