import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCEf2mLsMWEosjq3OrjGOcOKWifGmLzelM",
    authDomain: "ecub-v2.firebaseapp.com",
    projectId: "ecub-v2",
    storageBucket: "ecub-v2.appspot.com",
    messagingSenderId: "214420805388",
    appId: "1:214420805388:web:46c51e24fd1ea47115db29",
    measurementId: "G-86JX881R23"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };