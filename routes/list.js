import * as dynamoDbLib from '../libs/dynamodb-lib';
import { failure } from '../libs/response-lib';

export async function main(event, context) {
  const params = {
    TableName: 'PodcastStore',
    Limit: '5'
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
      return {
        status: 200,
        body: JSON.stringify(podcastObj)
      };
    } else {
      return failure({ status: false, error: 'Item not found.' });
    }
  } catch (e) {
    console.error(e);
    return failure({ status: false });
  }
}
