import firebaseConfig from '@/config/firebase'
import { getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)
