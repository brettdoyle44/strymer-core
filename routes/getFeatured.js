import * as dynamoDbLib from '../libs/dynamodb-lib';
import { success, failure } from '../libs/response-lib';

export async function main(event, context) {
  try {
    const batchResult = await dynamoDbLib.call('batchGet', {
      RequestItems: {
        'podcast-table': {
          Keys: [
            { podcastId: '5dd05b70-4f52-11ea-b7a3-131a91d5a736' },
            { podcastId: '5f083f30-4f52-11ea-b7a3-131a91d5a736' },
            { podcastId: '5fdf6550-4f52-11ea-b7a3-131a91d5a736' },
            { podcastId: 'd516e9f0-4f53-11ea-966e-55bf61926caf' }
          ]
        }
      }
    });
    const batchObj = batchResult.Responses['podcast-table'].map(podcast => {
      return {
        podcastId: podcast.podcastId,
        title: podcast.title,
        author: podcast.author,
        description: podcast.description,
        image: podcast.image
      };
    });
    return success(batchObj);
  } catch (e) {
    return failure(e);
  }
}
