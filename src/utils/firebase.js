import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCrh5PiLf2qaP3RYvKBVSyjw1_OQOzEQgI",
  authDomain: "recipehub-df287.firebaseapp.com",
  projectId: "recipehub-df287",
  storageBucket: "recipehub-df287.firebasestorage.app",
  messagingSenderId: "70151893169",
  appId: "1:70151893169:web:70ed90becc28b0f07c3290"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;