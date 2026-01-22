// Script to find notifications with null title
const { MongoClient } = require('mongodb');

async function main() {
  const uri = process.env.DATABASE_URL || 'YOUR_MONGODB_URI_HERE';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('windowshopdb');
    const notifications = await db.collection('Notification').find({ $or: [ { title: null }, { title: { $exists: false } } ] }).toArray();
    if (notifications.length === 0) {
      console.log('No notifications with null or missing title.');
    } else {
      console.log('Notifications with null or missing title:');
      notifications.forEach(n => console.log({ id: n._id, title: n.title, body: n.body }));
    }
  } finally {
    await client.close();
  }
}

main().catch(console.error);