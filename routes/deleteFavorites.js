import * as dynamoDbLib from '../libs/dynamodb-lib';
import { success, failure } from '../libs/response-lib';

export async function main(event, context) {
  const params = {
    TableName: 'podcast-favorites',
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      podcastId: event.pathParameters.id
    }
  };

  try {
    await dynamoDbLib.call('delete', params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
