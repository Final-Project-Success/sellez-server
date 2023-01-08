const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.URI);

let db = null;

async function connect() {
  try {
    const database = client.db("socket");
    db = database;
    return database;
  } catch (err) {
    await client.close();
    console.log(err);
  }
}

function getDb() {
  return db;
}

module.exports = {
  connect,
  getDb,
};
