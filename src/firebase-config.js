/**
 * Firebase & Cloud Firestore Configuration
 * 
 * Instructions:
 * 1. Go to Firebase Console: https://console.firebase.google.com/
 * 2. Select or create your project.
 * 3. Go to Project Settings -> General -> Your apps -> Click the Web icon (</>) to register an app.
 * 4. Copy the `firebaseConfig` keys provided by Firebase and paste them into the object below.
 * 5. In Firebase Console, go to "Build" -> "Firestore Database" and click "Create database" (start in test mode or set production rules).
 */

const firebaseConfig = {
    apiKey: "AIzaSyCU6MYjxc2mbXpeQ58VUTB29puCvGQpD1g",
    authDomain: "dhrumit-portfolio.firebaseapp.com",
    projectId: "dhrumit-portfolio",
    storageBucket: "dhrumit-portfolio.firebasestorage.app",
    messagingSenderId: "1039650507531",
    appId: "1:1039650507531:web:9bcadf8c59bbdd5b85f00e",
    measurementId: "G-04XQMKJHE3"
};

// Check if credentials have been filled in
function isFirebaseConfigured() {
    return true;
}

// Initialize Firebase & Firestore
let db = null;

try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps || firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
        console.log("Firebase initialized successfully.");
    } else {
        console.warn("Firebase SDK script not loaded yet.");
    }
} catch (error) {
    console.error("Error initializing Firebase:", error);
}

/**
 * Saves a contact message directly into Firestore 'messages' collection
 * @param {Object} data - Contact form data { name, email, subject, message }
 * @returns {Promise<Object>}
 */
async function saveContactMessage(data) {
    if (!isFirebaseConfigured()) {
        throw new Error("CONFIG_PLACEHOLDER");
    }

    if (!db) {
        if (typeof firebase !== 'undefined') {
            db = firebase.firestore();
        } else {
            throw new Error("Firebase is not loaded.");
        }
    }

    // Reference to 'messages' collection
    const messagesCollection = db.collection('messages');

    // Document to store
    const docData = {
        name: data.name,
        email: data.email,
        subject: data.subject || "General Inquiry",
        message: data.message,
        createdAt: new Date().toISOString(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: "unread"
    };

    const docRef = await messagesCollection.add(docData);
    return { id: docRef.id, ...docData };
}

// Expose globally for browser usage
window.firebaseConfig = firebaseConfig;
window.isFirebaseConfigured = isFirebaseConfigured;
window.saveContactMessage = saveContactMessage;
window.firestoreDb = db;
