import config from 'config';
import * as admin from 'firebase-admin';

export const app = admin.initializeApp({
  credential: admin.credential.cert(config.get('firebase.config')),
  databaseURL: config.get('firebase.rtdbUrl'),
});
