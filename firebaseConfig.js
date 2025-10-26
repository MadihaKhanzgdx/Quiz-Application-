
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCd6y6PVD9EoBht09c0wuHLaBZwOq31yKQ",
  authDomain: "my-right-side.firebaseapp.com",
  projectId: "my-right-side",
  storageBucket: "my-right-side.firebasestorage.app",
  messagingSenderId: "1059867544312",
  appId: "1:1059867544312:web:08f3b2bc3e6b6ff970090d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
