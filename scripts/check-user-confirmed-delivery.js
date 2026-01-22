// Script to check for userConfirmedDelivery and userConfirmedDeliveryAt fields in all orders

const { MongoClient } = require('mongodb');

async function main() {
  const uri = process.env.DATABASE_URL || 'YOUR_MONGODB_URI_HERE';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('windowshopdb');
    const orders = await db.collection('Order').find({}, {
      projection: {
        _id: 1,
        userId: 1,
        userConfirmedDelivery: 1,
        userConfirmedDeliveryAt: 1,
        deliveryStatus: 1
      }
    }).toArray();
    console.log('Order delivery confirmation fields:');
    orders.forEach(order => {
      console.log({
        id: order._id,
        userId: order.userId,
        deliveryStatus: order.deliveryStatus,
        userConfirmedDelivery: order.userConfirmedDelivery,
        userConfirmedDeliveryAt: order.userConfirmedDeliveryAt
      });
    });
  } finally {
    await client.close();
  }
}

main().catch(console.error);