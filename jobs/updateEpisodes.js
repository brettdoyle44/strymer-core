import { podcastIdArray } from '../resources/podcastIds';
import uuid from 'uuid';
import Parser from 'rss-parser';
import * as dynamoDbLib from '../libs/dynamodb-lib';
import { success, failure } from '../libs/response-lib';
let parser = new Parser();

export async function main() {
  try {
    for (const [idx, podcast] of podcastIdArray.entries()) {
      console.log(idx);
      // GET number of episodes associated with podcastId
      const podcastResult = await dynamoDbLib.call('query', {
        TableName: 'podcast-table',
        KeyConditionExpression: 'podcastId = :podcastId',
        ExpressionAttributeValues: {
          ':podcastId': podcast
        }
      });
      const podcastIdentity = podcastResult.Items[0].podcastId;
      // Check number of episodes
      const episodeResult = await dynamoDbLib.call('query', {
        TableName: 'episodes-table',
        IndexName: 'podcastId-index',
        KeyConditionExpression: 'podcastId = :podcastId',
        ExpressionAttributeValues: {
          ':podcastId': podcastIdentity
        }
      });
      const episodeLength = episodeResult.Items.length;
      // Parse XML
      let feed = await parser.parseURL(podcastResult.Items[0].rss);
      const parsedFeedLength = feed.items.length;
      if (episodeLength !== parsedFeedLength) {
        if (!feed.items[0].itunes.summary) {
          if (feed.items[0].content === '') {
            feed.items[0].content = 'none';
          }
          const episodesData = {
            podcastId: podcastIdentity,
            episodeId: uuid.v1(),
            title: feed.items[0].title,
            description: feed.items[0].content,
            pubDate: feed.items[0].pubDate,
            audioUrl: feed.items[0].enclosure.url
          };
          const episodeParams = {
            TableName: 'episodes-table',
            Item: {
              ...episodesData
            }
          };
          dynamoDbLib.call('put', episodeParams);
        } else {
          if (feed.items[feed.items.length - 1].itunes.summary === '') {
            feed.items[feed.items.length - 1].itunes.summary = 'none';
          }
          const episodesData = {
            podcastId: podcastIdentity,
            episodeId: uuid.v1(),
            title: feed.items[0].title,
            description: feed.items[0].itunes.summary,
            pubDate: feed.items[0].pubDate,
            audioUrl: feed.items[0].enclosure.url
          };
          const episodeParams = {
            TableName: 'episodes-table',
            Item: {
              ...episodesData
            }
          };
          dynamoDbLib.call('put', episodeParams);
        }
        console.log(
          `${podcastResult.Items[0].title} added a new episode with the title of ${feed.items[0].title}`
        );
      } else {
        continue;
      }
    }
    return success({ status: true });
  } catch (e) {
    console.error(e);
    return failure({ status: false });
  }
}
