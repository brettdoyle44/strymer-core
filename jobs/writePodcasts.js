import { podcastArray } from '../resources/podcasts';
import uuid from 'uuid';
import Parser from 'rss-parser';
import * as dynamoDbLib from '../libs/dynamodb-lib';
import { failure, success } from '../libs/response-lib';
let parser = new Parser();

export async function main() {
  try {
    for (const [idx, link] of podcastArray.entries()) {
      console.log(idx);
      let podcastId = uuid.v1();
      let feed = await parser.parseURL(link);
      if (!feed.items[feed.items.length - 1].itunes.summary) {
        feed.items.map(episode => {
          if (episode.content === '') {
            episode.content = 'none';
          }
          const episodesData = {
            podcastId: podcastId,
            episodeId: uuid.v1(),
            title: episode.title,
            description: episode.content,
            pubDate: episode.pubDate,
            audioUrl: episode.enclosure.url
          };
          const episodeParams = {
            TableName: 'episodes-table',
            Item: {
              ...episodesData
            }
          };
          dynamoDbLib.call('put', episodeParams);
        });
        const podcastData = {
          podcastId: podcastId,
          author: feed.itunes.author,
          title: feed.title,
          description: feed.description,
          image: feed.itunes.image,
          rss: link
        };
        const podcastParams = {
          TableName: 'podcast-table',
          Item: {
            ...podcastData
          }
        };
        dynamoDbLib.call('put', podcastParams);
      } else {
        feed.items.map(episode => {
          if (episode.itunes.summary === '') {
            episode.itunes.summary = 'none';
          }
          const episodesData = {
            podcastId: podcastId,
            episodeId: uuid.v1(),
            title: episode.title,
            description: episode.itunes.summary,
            pubDate: episode.pubDate,
            audioUrl: episode.enclosure.url
          };
          const episodeParams = {
            TableName: 'episodes-table',
            Item: {
              ...episodesData
            }
          };
          dynamoDbLib.call('put', episodeParams);
        });
        const podcastData = {
          podcastId: podcastId,
          author: feed.itunes.author,
          title: feed.title,
          description: feed.description,
          image: feed.itunes.image,
          rss: link
        };
        const podcastParams = {
          TableName: 'podcast-table',
          Item: {
            ...podcastData
          }
        };
        dynamoDbLib.call('put', podcastParams);
      }
    }
    return success({ status: true });
  } catch (e) {
    console.error(e);
    return failure({ status: false });
  }
}
