import * as dynamoDbLib from '../libs/dynamodb-lib';
import { success, failure } from '../libs/response-lib';

export async function main(event, context) {
  try {
    const batchResult = await dynamoDbLib.call('batchGet', {
      RequestItems: {
        'podcast-table': {
          Keys: [
            { podcastId: '147715d0-4f53-11ea-b8a5-2b262ce724f3' },
            { podcastId: '5c2b5e00-4f52-11ea-b7a3-131a91d5a736' },
            { podcastId: '5dd05b70-4f52-11ea-b7a3-131a91d5a736' },
            { podcastId: '5e342650-4f52-11ea-b7a3-131a91d5a736' },
            { podcastId: 'd86d67f0-4f53-11ea-966e-55bf61926caf' },
            { podcastId: '5e141b30-4f52-11ea-b7a3-131a91d5a736' },
            { podcastId: '5cc728d0-4f52-11ea-b7a3-131a91d5a736' },
            { podcastId: '0ab9a580-4f53-11ea-b8a5-2b262ce724f3' },
            { podcastId: '0ddb30d0-4f53-11ea-b8a5-2b262ce724f3' },
            { podcastId: '630f96a0-4f52-11ea-b7a3-131a91d5a736' },
            { podcastId: '5d7b84b0-4f52-11ea-b7a3-131a91d5a736' },
            { podcastId: '156434f0-4f53-11ea-b8a5-2b262ce724f3' },
            { podcastId: '14121270-4f53-11ea-b8a5-2b262ce724f3' },
            { podcastId: '10ea93b0-4f53-11ea-b8a5-2b262ce724f3' },
            { podcastId: 'd7bd9ff0-4f53-11ea-966e-55bf61926caf' },
            { podcastId: '5f993491-4f52-11ea-b7a3-131a91d5a736' }
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
