import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyC6emty5b5f-CR6wI4hY8C3gwJbiULrQE0",
  authDomain: "recipieapp-b2b36.firebaseapp.com",
  projectId: "recipieapp-b2b36",
  storageBucket: "recipieapp-b2b36.appspot.com",
  messagingSenderId: "445795859461",
  appId: "1:445795859461:web:4234629cc6e47810f1306c",
  measurementId: "G-DWGXEWKQFX"
};

const app = initializeApp(firebaseConfig);
export const storage=getStorage(app);