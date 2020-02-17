// Print podcast Ids

// export async function main() {
//   const params = {
//     TableName: 'podcast-table'
//   };
//   try {
//     const result = await dynamoDbLib.call('scan', params);
//     if (result.Items) {
//       const podcastObj = result.Items.map(podcast => {
//         return podcast.podcastId;
//       });
//       return success(podcastObj);
//     } else {
//       return failure({ status: false, error: 'Item not found.' });
//     }
//   } catch (e) {
//     console.error(e);
//   }
// }
