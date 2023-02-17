import firebase from "firebase/app";
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAJ3ebC0f6G2dp87w61VDxsNo4LS3K6KP0",
    authDomain: "controle-de-produtos-2c4c9.firebaseapp.com",
    projectId: "controle-de-produtos-2c4c9",
    storageBucket: "controle-de-produtos-2c4c9.appspot.com",
    messagingSenderId: "53978455689",
    appId: "1:53978455689:web:db6bd22f896e6722f13058"
  };

export default firebase.initializeApp(firebaseConfig)