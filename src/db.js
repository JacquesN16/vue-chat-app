import firebase from "firebase/app";
import "firebase/database";


const config = {
    //API key
    apiKey: "AIzaSyBF5oGqNBpnuB3e6Sa9_-rfgBoXDJ3FKFo",
    authDomain: "vue-chap-app-8b015.firebaseapp.com",
    databaseURL: "https://vue-chap-app-8b015-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "vue-chap-app-8b015",
    storageBucket: "vue-chap-app-8b015.appspot.com",
    messagingSenderId: "38729228370",
    appId: "1:38729228370:web:b71b803f74c170681f3f8b"
}

const db =firebase.initializeApp(config);
export default db;