import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBYRE30t-DUwU5x5CGGhpm73abJs3Sl4Ak",
  authDomain: "mi-proyecto-af91e.firebaseapp.com",
  databaseURL: "https://mi-proyecto-af91e-default-rtdb.firebaseio.com",
  projectId: "mi-proyecto-af91e",
  storageBucket: "mi-proyecto-af91e.firebasestorage.app",
  messagingSenderId: "16996858647",
  appId: "1:16996858647:web:7b969c1c6fc10e5aad5552"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
