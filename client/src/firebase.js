// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: 'mern-blog-766eb.firebaseapp.com',
    projectId: 'mern-blog-766eb',
    storageBucket: 'mern-blog-766eb.appspot.com',
    messagingSenderId: '844902984638',
    appId: '1:844902984638:web:39ffd2c2730384ff0ba7ef',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
