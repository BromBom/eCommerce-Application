import { CustomerSignInResult, CustomerDraft, Customer } from '@commercetools/platform-sdk';
import { apiRoot } from './BuildClient';
import { handleError, showLoading, hideLoading } from '../app/utils/showmessage';

export const createCustomer = async (customerData: CustomerDraft): Promise<Customer> => {
  try {
    showLoading();
    const response = await apiRoot
      .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
      .customers()
      .post({
        body: customerData,
      })
      .execute();

    hideLoading();
    const signInResult: CustomerSignInResult = response.body;
    return signInResult.customer;
  } catch (error) {
    console.error(`Failed to create customer: ${error}`);
    if (error instanceof Error) handleError(error, error.message);
    throw new Error(`Failed to create customer: ${error}`);
  }
};

export const SetDefaultBillingAddress = async (
  customerID: string,
  customerVersion: number,
  addressId: string | undefined
) => {
  try {
    showLoading();
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
    hideLoading();
    return response;
  } catch (error) {
    if (error instanceof Error) handleError(error, error.message);
    throw new Error(`Failed to set Default Billing Address: ${error}`);
  }
};

export const SetDefaultShippingAddress = async (
  customerID: string,
  customerVersion: number,
  addressId: string | undefined
) => {
  try {
    showLoading();
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
    hideLoading();
    return response;
  } catch (error) {
    if (error instanceof Error) handleError(error, error.message);
    throw new Error(`Failed to set Default Shipping Address: ${error}`);
  }
};

export const getCustomerByID = async (customerID: string) => {
  try {
    showLoading();
    const response = await apiRoot
      .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
      .customers()
      .withId({ ID: customerID })
      .get()
      .execute();

    hideLoading();
    const customer = response.body;

    return customer;
  } catch (error) {
    if (error instanceof Error) handleError(error, error.message);
    throw error;
  }
};
