import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ctpClient } from './BuildClient';

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

export default getProject;
