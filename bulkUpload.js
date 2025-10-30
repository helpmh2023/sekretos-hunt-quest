// bulkUpload.js - Node.js Script (ES Module Syntax)

// --- ES Module Imports ---
import admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Build service account object from environment variables
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};

// Firebase configuration from environment variables
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
};

// Function to generate the consistent email (MUST match the logic in src/firebase/config.ts)
const getAgentEmail = (agentName) => {
    return `${agentName.toLowerCase()}@sekretos.club`;
};

async function uploadSecrets() {
    try {
        // Initialize Firebase Admin SDK with service account from env variables
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: firebaseConfig.projectId,
            });
        }

        const db = admin.firestore();
        
        // Load Agent Secrets JSON
        const secretsFilePath = path.resolve('./agentSecrets.json');
        const secretsJsonContent = fs.readFileSync(secretsFilePath, 'utf8');
        // Your JSON structure uses "AgentName" and "AgentSecret"
        const secretsData = JSON.parse(secretsJsonContent); 

        console.log(`Starting upload of ${secretsData.length} agent secrets...`);
        
        const batch = db.batch();
        const secretsCollection = db.collection('secrets');

        secretsData.forEach((item) => {
            // Normalize the name to be consistent and safe for a document ID
            const agentName = item.AgentName.toUpperCase().replace(/[^A-Z0-9]/g, '_');
            
            const docRef = secretsCollection.doc(agentName);
            
            const agentData = {
                agentName: item.AgentName,
                agentSecret: item.AgentSecret, 
                email: getAgentEmail(item.AgentName), 
                isAssigned: false, 
                assignedToUID: null,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            };

            batch.set(docRef, agentData);
        });

        await batch.commit();
        console.log(`✅ Successfully uploaded ${secretsData.length} secrets to the 'secrets' collection.`);

    } catch (error) {
        console.error("❌ BATCH WRITE FAILED.");
        if (error.message?.includes('credential')) {
            console.error("-> CRITICAL ERROR: Firebase credentials are missing or invalid. Check your .env file.");
        } else {
             console.error("-> Error details:", error);
        }
        process.exit(1);
    }
}

uploadSecrets();