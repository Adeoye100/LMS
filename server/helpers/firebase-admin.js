const admin = require("firebase-admin");

// Check for required environment variables
const requiredEnv = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_STORAGE_BUCKET",
];

const missingEnv = requiredEnv.filter(key => !process.env[key]);

if (missingEnv.length > 0) {
  console.error(
    `Firebase Admin SDK initialization failed: Missing required environment variables: ${missingEnv.join(", ")}`
  );
  console.error("Please check your .env file in the /server directory.");
} else if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key needs to have its newline characters correctly formatted
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
    console.log("Firebase Admin SDK initialized successfully.");
  } catch (error) {
    console.error("Firebase Admin SDK initialization failed with an unexpected error:", error);
  }
}

module.exports = admin;
