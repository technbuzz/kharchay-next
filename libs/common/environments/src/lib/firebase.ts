import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { environment } from './environment';

function initialize() {
  const firebaseApp = initializeApp(environment.firebase);
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp)
  return { firebaseApp, auth, firestore };
}
// import { getFirestore, connectFirestoreEmulator, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

// function initialize() {
//   const firebaseApp = initializeApp(config.firebase);
//   const auth = getAuth(firebaseApp);
//   const firestore = getFirestore(firebaseApp);
//   return { firebaseApp, auth, firestore };
// }

export function getFirebase() {
  return initialize()
}
