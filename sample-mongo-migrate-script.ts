import { Db, MongoClient } from 'mongodb';

export = {
  async up(db: Db, client: MongoClient) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    const session = client.startSession();
    try {
        await session.withTransaction(async () => {
            await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
            await db.collection('albums').updateOne({artist: 'The Doors'}, {$set: {stars: 5}});
        });
    } finally {
      await session.endSession();
    }
  },

  async down(db: Db, client: MongoClient) {
    // TODO write the statements to rollback your migration (if possible)
    // Example
    const session = client.startSession();
    try {
        await session.withTransaction(async () => {
            await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
            await db.collection('albums').updateOne({artist: 'The Doors'}, {$set: {stars: 0}});
        });
    } finally {
      await session.endSession();
    }
  },
};
