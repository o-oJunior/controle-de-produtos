import firebase from "firebase/app";
import "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAzOevwAkMGdAj4Yu8xsIcngVEv7xk8bpg",
  authDomain: "controle-de-produtos-cda02.firebaseapp.com",
  projectId: "controle-de-produtos-cda02",
  storageBucket: "controle-de-produtos-cda02.appspot.com",
  messagingSenderId: "46546460335",
  appId: "1:46546460335:web:097a3210fd7a99c9723e5a"
};

export default firebase.initializeApp(firebaseConfig)
