import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import ctpClient from './client';

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: 'jsfe2023q4shop' });

const getProject = () => {
  return apiRoot.get().execute();
};

getProject().then(console.log).catch(console.error);

apiRoot
  .shoppingLists()
  .withId({ ID: 'a-shoppinglist-id' })
  .get()
  .execute()
  .then(({ body }) => {
    console.log(JSON.stringify(body));
  })
  .catch(console.error);

// const getEndPoint = () => {
//   return apiRoot.shoppingLists().get();
// };

export default getProject;
