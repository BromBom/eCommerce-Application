import { CustomerSignInResult, CustomerDraft } from '@commercetools/platform-sdk';
import { apiRoot } from './BuildClient';

export const createCustomer = async (customerData: CustomerDraft) => {
  const response = await apiRoot
    .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
    .customers()
    .post({
      body: customerData,
    })
    .execute();

  const signInResult: CustomerSignInResult = response.body;
  return signInResult.customer;
};

export const SetDefaultBillingAddress = async (
  customerID: string,
  customerVersion: number,
  addressId: string | undefined
) => {
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
};

export const SetDefaultShippingAddress = async (
  customerID: string,
  customerVersion: number,
  addressId: string | undefined
) => {
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
};

export const getCustomerByID = async (customerID: string) => {
  const response = await apiRoot
    .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
    .customers()
    .withId({ ID: customerID })
    .get()
    .execute();

  const customer = response.body;

  return customer;
};

export const changeAddress = async (
  customerID: string,
  customerVersion: number,
  addressId: string,
  country: string,
  postalCode: string,
  city: string,
  streetName: string,
  apartment: string
) => {
  const response = await apiRoot
    .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
    .customers()
    .withId({ ID: customerID })
    .post({
      body: {
        version: customerVersion,
        actions: [
          {
            action: 'changeAddress',
            addressId,
            address: {
              country,
              postalCode,
              city,
              streetName,
              apartment,
            },
          },
        ],
      },
    })
    .execute();

  return response;
};

export const addAddress = async (
  customerID: string,
  customerVersion: number,
  country: string,
  postalCode: string,
  city: string,
  streetName: string,
  apartment: string
) => {
  const response = await apiRoot
    .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
    .customers()
    .withId({ ID: customerID })
    .post({
      body: {
        version: customerVersion,
        actions: [
          {
            action: 'addAddress',
            address: {
              country,
              postalCode,
              city,
              streetName,
              apartment,
            },
          },
        ],
      },
    })
    .execute();

  return response;
};

export const updateProfile = async (
  customerID: string,
  customerVersion: number,
  firstName: string,
  lastName: string,
  email: string,
  dateOfBirth: string
) => {
  const response = await apiRoot
    .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
    .customers()
    .withId({ ID: customerID })
    .post({
      body: {
        version: customerVersion,
        actions: [
          {
            action: 'setFirstName',
            firstName: firstName,
          },
          {
            action: 'setLastName',
            lastName: lastName,
          },
          {
            action: 'setDateOfBirth',
            dateOfBirth: dateOfBirth,
          },
          {
            action: 'changeEmail',
            email: email,
          },
        ],
      },
    })
    .execute();

  return response;
};

export const changePassword = async (
  customerID: string,
  customerVersion: number,
  currentPassword: string,
  newPassword: string
) => {
  const response = await apiRoot
    .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
    .customers()
    .password()
    .post({
      body: {
        id: customerID,
        version: customerVersion,
        currentPassword: currentPassword,
        newPassword: newPassword,
      },
    })
    .execute();

  return response;
};