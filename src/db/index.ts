import { initializeApp } from 'firebase/app';
import {collection, getDocs, getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDtYxYJh9DpE4KVjAlFVvAAc0IuQFwYhMk',
  authDomain: 'glider-324d6.firebaseapp.com',
  projectId: 'glider-324d6',
  storageBucket: 'glider-324d6.appspot.com',
  messagingSenderId: '245288529001',
  appId: '1:245288529001:web:964a30aea9e358bca7c6f8',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const fbAuth = getAuth(app);


