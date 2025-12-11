const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectDb, disconnectDb, getConnection } = require('../db/connect');

let mongoServer;

const connectTestDb = async () => {
  if (process.env.USE_IN_MEMORY_DB === 'true') {
    mongoServer = await MongoMemoryServer.create({
      instance: { ip: '127.0.0.1' },
    });
    const uri = mongoServer.getUri();
    const dbName = process.env.DB_NAME_TEST || 'MealMosaicTest';
    await connectDb(uri, { dbName });
    return;
  }

  const uri = process.env.MONGODB_URI_TEST;
  const dbName = process.env.DB_NAME_TEST || 'MealMosaicTest';

  if (!uri) {
    throw new Error('Set MONGODB_URI_TEST before running tests');
  }

  await connectDb(uri, { dbName });
};

const clearDatabase = async () => {
  const connection = getConnection();
  const collections = connection.collections;
  const promises = Object.values(collections).map((collection) => collection.deleteMany({}));
  await Promise.all(promises);
};

const stopTestDb = async () => {
  await disconnectDb();
  if (mongoServer) {
    await mongoServer.stop();
  }
};

module.exports = { connectTestDb, disconnectDb: stopTestDb, clearDatabase };
