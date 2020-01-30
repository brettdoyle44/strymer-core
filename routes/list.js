import * as dynamoDbLib from '../libs/dynamodb-lib';
import { success, failure } from '../libs/response-lib';
import algoliasearch from 'algoliasearch';

export async function main(event, context) {
  const params = {
    TableName: 'PodcastStore'
  };
  try {
    const result = await dynamoDbLib.call('scan', params);
    if (result.Items) {
      const podcastObj = result.Items.map(podcast => {
        return {
          podcastId: podcast.podcastId,
          title: podcast.title,
          author: podcast.author,
          description: podcast.description,
          image: podcast.image
        };
      });
      const searchClient = algoliasearch(
        process.env.algoliaAppKeyEnvVar,
        process.env.algoliaAdminKeyEnvVar
      );
      const index = searchClient.initIndex('podcast-search');
      index.addObjects(podcastObj, function(err, content) {
        if (err) {
          console.error(err);
        }
      });
      return success(podcastObj);
    } else {
      return failure({ status: false, error: 'Item not found.' });
    }
  } catch (e) {
    console.error(e);
    return failure({ status: false });
  }
}
