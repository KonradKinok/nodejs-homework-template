import mongoose from "mongoose";
const username = encodeURIComponent(process.env.DB_USERNAME);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const cluster = process.env.DB_CLUSTER;
const appName = process.env.DB_APPNAME;
const dbName = process.env.DB_DBNAME;
const uri2 =
  "mongodb+srv://konradkonikpoczta:K3gBMlkokxeneqhJ@mongodbkonrad.ebhjm.mongodb.net/db-contacts?retryWrites=true&w=majority&appName=MongoDbKonrad";
const uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority&appName=${appName}`;
console.log(uri2);
console.log(uri);
export const connectDB = async () => {
  try {
    console.log(`[DB] Connecting to MongoDB: ${dbName} ...`.blue);
    await mongoose.connect(uri2);
    console.log(`[DB] MongoDB: ${dbName} connected successfully`.blue);
  } catch (error) {
    console.error(
      `[DB] Error connecting to MongoDB: ${dbName} :${error.message}`.red
    );
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("[DB] MongoDB disconnected successfully".blue);
  } catch (error) {
    console.error(
      `[DB] Error disconnecting from MongoDB: ${error.message}`.red
    );
    process.exit(1);
  }
};

export function checkConnectionState() {
  const state = mongoose.connections[0].readyState;
  const stateText = mongoose.connections[0].states[state];
  console.log(`Current connection state: ${stateText}`);
  return state;
}
