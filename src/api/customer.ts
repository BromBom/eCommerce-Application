import { CustomerSignInResult, CustomerDraft, Customer } from '@commercetools/platform-sdk';
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
    return signInResult.customer;
  } catch (error) {
    console.error(`Failed to create customer: ${error}`);
    throw new Error(`Failed to create customer: ${error}`);
  }
};

export const SetDefaultBillingAddress = async (
  customerID: string,
  customerVersion: number,
  addressId: string | undefined
) => {
  try {
    const response = await apiRoot
      .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
      .customers()
      .withId({ ID: customerID })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'setDefaultBillingAddress',
              addressId,
            },
          ],
        },
      })
      .execute();
    return response;
  } catch (error) {
    console.error(`Failed to set Default Billing Address: ${error}`);
    throw new Error(`Failed to set Default Billing Address: ${error}`);
  }
};

export const SetDefaultShippingAddress = async (
  customerID: string,
  customerVersion: number,
  addressId: string | undefined
) => {
  try {
    const response = await apiRoot
      .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
      .customers()
      .withId({ ID: customerID })
      .post({
        body: {
          version: customerVersion,
          actions: [
            {
              action: 'setDefaultShippingAddress',
              addressId,
            },
          ],
        },
      })
      .execute();
    return response;
  } catch (error) {
    console.error(`Failed to set Default Shipping Address: ${error}`);
    throw new Error(`Failed to set Default Shipping Address: ${error}`);
  }
};

export const getCustomerByID = async (customerID: string) => {
  try {
    const response = await apiRoot
      .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
      .customers()
      .withId({ ID: customerID })
      .get()
      .execute();

    const customer = response.body;

    return customer;
  } catch (error) {
    console.error(`Failed to get customer by email: ${error}`);
    throw error;
  }
};
