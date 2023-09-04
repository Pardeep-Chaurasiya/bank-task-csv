const { MongoClient } = require("mongodb");

const connectDB = async (req, res) => {
  const mongoURI =
    "mongodb+srv://excellence-pardeep:excellence-pardeep@cluster0.mfk2efk.mongodb.net/";
  const dbName = "CSV_Upload";
  const client = new MongoClient(mongoURI);

  await client.connect(); // Connect to MongoDB server
  const db = client.db(dbName);
  const collection = db.collection("commondata");

  console.log("first");
};

module.exports = { connectDB };
