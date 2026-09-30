# Firebase Firestore Setup Guide for Contact Form

This guide helps you connect your portfolio website to your Firebase Cloud Firestore database so that whenever a visitor fills out the **Contact Me** form, their message is automatically saved into your database.

---

## Step 1: Open Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or select your existing project).
3. Name your project (e.g., `dhrumit-portfolio`) and complete the creation steps.

---

## Step 2: Create a Cloud Firestore Database
1. In the left navigation menu, expand **Build** and click **Firestore Database**.
2. Click **Create database**.
3. Choose a location closest to you or your target audience (e.g., `asia-south1` or `nam5 (us-central)`).
4. For security rules during setup, select **Start in test mode** (allows read/write for 30 days) or configure production rules (see Step 4 below).
5. Click **Enable**.

---

## Step 3: Get Your Web App API Keys & Config
1. In the Firebase Console, click the **Settings (gear icon)** next to *Project Overview* -> **Project settings**.
2. Under the **General** tab, scroll down to the **Your apps** section.
3. If no app exists, click the **Web icon (`</>`)** to register a web app:
   - App nickname: `portfolio-web`
   - You can leave Firebase Hosting unchecked for now.
   - Click **Register app**.
4. You will see a `firebaseConfig` object that looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789...",
     appId: "1:123456789:web:abcdef..."
   };
   ```
5. Open `src/firebase-config.js` in your project folder.
6. Replace the placeholder values with your actual keys from Firebase. Save the file.

---

## Step 4: Recommended Firestore Security Rules
To allow any visitor on your portfolio to submit contact messages while keeping other people from reading or deleting messages, set your rules in the Firebase Console:

1. In Firebase Console, go to **Firestore Database** -> **Rules** tab.
2. Replace the rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to create (submit) a message with valid fields
    match /messages/{messageId} {
      allow create: if request.resource.data.name is string
                    && request.resource.data.email is string
                    && request.resource.data.message is string;
      // Disallow public read, update, and delete to protect your privacy
      allow read, update, delete: if false;
    }
  }
}
```
3. Click **Publish**.

*(Note: As the project owner, you can view, read, and manage all received messages directly from the Firebase Console under **Firestore Database -> Data** tab).*

---

## Step 5: How It Works
- Whenever a user enters their name, email, subject, and message in the Contact section and clicks **Send Message**:
  - The website validates the fields.
  - The submit button shows a loading state (`Sending...`).
  - The data is saved to the `messages` collection in Firestore with:
    - `name`
    - `email`
    - `subject`
    - `message`
    - `createdAt` (ISO string)
    - `timestamp` (Server timestamp)
    - `status: "unread"`
  - A notification toast confirms submission: *"Thank you, [Name]! Your message has been sent successfully."*
  - The form is cleared automatically.
