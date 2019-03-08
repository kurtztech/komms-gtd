import Rebase from "re-base";
import firebase from "firebase";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderI: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
};

const firebaseApp = firebase.initializeApp(config);

const base = Rebase.createClass(firebaseApp.database());

export { firebaseApp };
export default base;
