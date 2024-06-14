import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBCZgG4qe2uZFfeEa0EUcmEuZyT_OReRDg",
  authDomain: "treslineas-d539c.firebaseapp.com",
  databaseURL: "https://treslineas-d539c-default-rtdb.firebaseio.com",
  projectId: "treslineas-d539c",
  storageBucket: "treslineas-d539c.appspot.com",
  messagingSenderId: "379175249733",
  appId: "1:379175249733:web:368b3b2c62a3e6deea802c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

export { db };
