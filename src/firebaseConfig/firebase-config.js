import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB3n6UP_7CEeDmo9n-7M6LNK9bzX_PBiIs",
    authDomain: "babyshower-431fb.firebaseapp.com",
    projectId: "babyshower-431fb",
    storageBucket: "babyshower-431fb.appspot.com",
    messagingSenderId: "900615828652",
    appId: "1:900615828652:web:afa394a1ac3a0d867f5b09"
};

const appFirebase = initializeApp(firebaseConfig);
export const db = getFirestore(appFirebase);
