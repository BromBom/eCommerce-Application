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

interface Address {
  country: string;
}

interface CustomerDraft {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  key: string;
  addresses: Address[];
}

// interface CustomerUpdate {
//   version: number;
//   actions: Array<{ setFirstName: { firstName: string } } | { setLastName: { lastName: string } }>;
// }

// interface CustomerPagedQueryResponse {
//   count: number;
//   results: Customer[];
// }

export const getCustomersById = async (ID: string): Promise<Customer> => {
  try {
    const customerResponse = await apiRoot
      .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
      .customers()
      .withId({ ID })
      .get()
      .execute();

    const customer: Customer = customerResponse.body;
    return customer;
  } catch (error) {
    throw new Error(`Failed to get customer with ID ${ID}: ${error}`);
  }
};

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const customersRequest = apiRoot
      .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
      .customers()
      .get({
        queryArgs: {
          expand: 'paymentInfo.payments[*].id',
        },
      });

    const customersResponse = await customersRequest.execute();
    const customers: Customer[] = customersResponse.body.results;
    return customers;
  } catch (error) {
    throw new Error(`Failed to get customers: ${error}`);
  }
};

const customerDraftData: CustomerData = {
  firstName: 'test',
  lastName: 'test',
  email: 'test@test.com',
  password: 'password',
  key: 'test123',
  countryCode: 'DE',
};

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

createCustomerDraft(customerDraftData)
  .then((customerDraft: CustomerDraft) => {
    console.log(customerDraft);
  })
  .catch((error) => {
    console.error(error);
  });

export const createCustomer = async (customerData: CustomerData): Promise<void> => {
  try {
    const customerDraft = await createCustomerDraft(customerData);
    await apiRoot
      .withProjectKey({ projectKey: process.env.CTP_PROJECT_KEY || '' })
      .customers()
      .post({
        body: customerDraft,
      })
      .execute();
  } catch (error) {
    throw new Error(`Failed to create customer: ${error}`);
  }
};

// module.exports.getCustomersByKey = (key) => {};

// async function getCustomerByEmail(email: string): Promise<Customer | null> {
//   try {
//     const customerToFind: CustomerPagedQueryResponse = await apiRoot
//       .customers()
//       .get()
//       .where(`email = "${email}"`)
//       .execute();

//     if (customerToFind.count === 0) {
//       console.log('This email address has not been registered.');
//       return null;
//     }

//     const foundCustomerID: string = customerToFind.results[0].id;
//     console.log(`Customer ID found by email: ${foundCustomerID}`);
//     return customerToFind.results[0];
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// async function updateCustomerName(customerID: string, firstName: string, lastName: string): Promise<Customer> {
//   const customerUpdate: CustomerUpdate = {
//     version: 1,
//     actions: [{ setFirstName: { firstName } }, { setLastName: { lastName } }],
//   };

//   try {
//     const updatedCustomer: Customer = await apiRoot.customers().withId(customerID).post(customerUpdate).execute();
//     console.log(`Updated Customer Name: ${updatedCustomer.firstName} ${updatedCustomer.lastName}`);
//     return updatedCustomer;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }

// (async () => {
//   try {
//     const newCustomer: Customer = await createCustomer('sdk@example.com', 'password');
//     const queryCustomer: Customer | null = await getCustomerByEmail(newCustomer.email);

//     if (queryCustomer) {
//       await updateCustomerName(newCustomer.id, 'John', 'Smith');
//       await getCustomerByEmail(newCustomer.email); // Поиск клиента по адресу электронной почты
//     }
//   } catch (error) {
//     console.error(error);
//   }
// })();
