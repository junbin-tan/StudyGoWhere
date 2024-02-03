// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8CHXoCgQ1b_lQY_5_UoBZYTPI1b1y7l8",
  authDomain: "imagestorage-a2728.firebaseapp.com",
  projectId: "imagestorage-a2728",
  storageBucket: "imagestorage-a2728.appspot.com",
  messagingSenderId: "762666672886",
  appId: "1:762666672886:web:5eb64c3a9c2da2cdf4c2d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;