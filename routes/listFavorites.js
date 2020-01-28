import * as dynamoDbLib from '../libs/dynamodb-lib';
import { success, failure } from '../libs/response-lib';

export async function main(event, context) {
  const params = {
    TableName: 'podcast-favorites',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': event.requestContext.identity.cognitoIdentityId
    }
  };

  try {
    const result = await dynamoDbLib.call('query', params);
    const mappedResult = await result.Items.map(podcast => ({
      podcastId: podcast.podcastId
    }));
    const batchResult = await dynamoDbLib.call('batchGet', {
      RequestItems: {
        PodcastStore: {
          Keys: [...mappedResult]
        }
      }
    });
    const batchObj = batchResult.Responses.PodcastStore.map(podcast => {
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
