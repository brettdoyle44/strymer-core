import * as dynamoDbLib from '../libs/dynamodb-lib';
import { success, failure } from '../libs/response-lib';

export async function main(event, context) {
  const podcastParams = {
    TableName: 'podcast-table',
    Key: {
      podcastId: event.pathParameters.id
    }
  };
  const episodesParams = {
    TableName: 'episodes-table',
    IndexName: 'podcastId-index',
    KeyConditionExpression: 'podcastId = :podcastId',
    ExpressionAttributeValues: {
      ':podcastId': event.pathParameters.id
    }
  };
  try {
    const result = await dynamoDbLib.call('get', podcastParams);
    const episodes = await dynamoDbLib.call('query', episodesParams);
    return success({
      ...result.Item,
      episodes: [...episodes.Items]
    });
  } catch (e) {
    console.error(e);
    return failure({ status: false });
  }
}

// 0a226e90-4f53-11ea-b8a5-2b262ce724f3
