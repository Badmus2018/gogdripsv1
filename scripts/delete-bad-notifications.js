// Script to delete notifications with null or missing title
const { MongoClient } = require('mongodb');

async function main() {
  const uri = process.env.DATABASE_URL || 'YOUR_MONGODB_URI_HERE';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('windowshopdb');
    const result = await db.collection('Notification').deleteMany({ $or: [ { title: null }, { title: { $exists: false } } ] });
    console.log(`Deleted ${result.deletedCount} notifications with null or missing title.`);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
