import * as sdk from "node-appwrite";

export const {
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
} = process.env;

const client = new sdk.Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("678d75c10039401e32f0")
  .setKey("standard_c0dfb4cdb220c57f21c44cd5e3398933f8ec3fcacef53bbb462a3146acb42066ecfab80ee2e18292c00796164fb166a5ab1662dbd0ba5acaa1847e7231430ac0fd6b8d93703633fe5de383c95336de6296934011bec9d3d02d8cff1a5d8333d04aeb55cdf6b5d14b01f735dc43a35e77ba39a62a085dc9411e473c572453e85e");

export const databases = new sdk.Databases(client);
export const users = new sdk.Users(client);
export const messaging = new sdk.Messaging(client);
export const storage = new sdk.Storage(client);