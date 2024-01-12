import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");

let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}

let db = conn.db("online_shop");

export default db;