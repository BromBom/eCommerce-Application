import { apiRoot, projectKey } from './client';

const getProjectDetails = async () => {
  if (projectKey === undefined) {
    throw new Error('Project key is undefined');
  }

  try {
    const response = await apiRoot.withProjectKey({ projectKey }).get().execute();
    return response;
  } catch (error) {
    console.error('Error fetching project details:', error);
    throw error;
  }
};

export default getProjectDetails;