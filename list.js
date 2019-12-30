import axios from 'axios';

export async function main(event, content) {
  const options = {
    headers: {
      'X-ListenAPI-Key': process.env.listenNotesEnvVar,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  const data =
    'ids=1fa910c631644be8b091cf4cd587d82f,0a058283615c4af2b65f64ef06b63417';
  try {
    const response = await axios.post(
      'https://listen-api.listennotes.com/api/v2/podcasts',
      data,
      options
    );
    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (e) {
    console.error(e);
  }
}
