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
    console.log(batchResult);
    return success(batchResult);
  } catch (e) {
    return failure(e);
  }
}
