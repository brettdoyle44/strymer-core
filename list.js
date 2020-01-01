import axios from 'axios';
import theIds from './ids.js';

export async function main(event, content) {
  //   const options = {
  //     headers: {
  //       'X-ListenAPI-Key': process.env.listenNotesEnvVar,
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     }
  //   };
  const splitPodcasts = theIds.splice(0, 10);
  const currentPodcasts = splitPodcasts.join();
  try {
    const response = await axios({
      method: 'post',
      url: `https://listen-api.listennotes.com/api/v2/podcasts`,
      headers: {
        'X-ListenAPI-Key': process.env.listenNotesEnvVar,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: `ids=${currentPodcasts}`
    });
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (e) {
    console.error(e);
  }
}
